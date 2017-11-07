import { Setting, User, Post } from '../apis'
import Moment from 'moment'
import * as Markdown from '../utils/markdown'

export function createActions () {

  let fetchingSettings
  const fetchingUsers = {}

  return {
    fetchSettings ({ commit }) {
      if (!fetchingSettings) {
        fetchingSettings = Setting.get()
          .then(({ data: settings }) => {
            fetchingSettings = null
            commit('UPDATE_SETTINGS', settings)
          })
      }
      return fetchingSettings
    },
    // avoid fetching same user multiple times
    fetchUser (_, id) {
      if (!fetchingUsers[id]) {
        fetchingUsers[id] = User.getById(id).then(({ data }) => data)
      }
      return fetchingUsers[id]
    },
    async fetchPosts ({ state, commit, dispatch }, index) {
      if (!state.settings) {
        await dispatch('fetchSettings')
      }
      const postPerPage = state.settings.postPerPage || 5
      const { data: posts, totalCount } = await Post.getAll({ limit: postPerPage, offset: index * postPerPage, sort: { createdAt: 'desc' } })
      const pageCount = Math.ceil(totalCount / postPerPage)
      // fetch tags and author info
      await Promise.all(posts.map(async post => {
        const [ tags, author, createdAtFormated, abstract ] = await Promise.all([
          Post.Tag.getAll(post.url).then(({ data: tags }) => tags),
          dispatch('fetchUser', post.author),
          Promise.resolve(Moment(post.createdAt).format('YYYY/MM/DD')),
          Promise.resolve(Markdown.renderText(Markdown.parse(post.markdown || ''), { limit: 300 })),
        ])
        Object.assign(post, { tags, author, createdAtFormated, abstract })
      }))
      commit('UPDATE_DATA', { index, totalCount, pageCount, posts })
    },
    async fetchPost ({ state, commit, dispatch }, url) {
      if (!state.settings) {
        await dispatch('fetchSettings')
      }
      const { data: post } = await Post.getByUrl(url)
      post.html = Markdown.render(Markdown.parse(post.markdown || ''))
      post.createdAtFormated = Moment(post.createdAt).format('YYYY/MM/DD HH:mm:ss')
      commit('UPDATE_DATA', post)
    },
  }
}
