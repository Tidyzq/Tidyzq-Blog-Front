<template lang='pug'>
  .posts
    post(v-for='post in posts' key='post.id', :post='post')
</template>

<script>
import { mapGetters } from 'vuex'
import { User, Post } from '../../apis'

import PostComponent from '@/components/blog/Post'

export default {
  async asyncData ({ store, route }) {
    if (!store.state.settings) {
      await store.dispatch('fetchSettings')
    }
    const postPerPage = store.state.settings.postPerPage || 5
    const index = parseInt(route.query.page) || 0
    const { data: posts, totalCount } = await Post.getAll({ limit: postPerPage, offset: index * postPerPage })
    // avoid fetching same author multiple times
    const fetchingAuthor = {}
    const fetchAuthor = id => {
      if (!fetchAuthor[id]) {
        fetchAuthor[id] = User.getById(id)
          .then(data => {
            fetchingAuthor[id] = undefined
            return data
          })
      }
      return fetchAuthor[id]
    }
    // fetch tags and author info
    await Promise.all(posts.map(post => Promise.all([
      Post.Tag.getAll(post.url)
        .then(({ data: tags }) => Object.assign(post, { tags })),
      fetchAuthor(post.author)
        .then(({ data: author }) => Object.assign(post, { author })),
    ])))
    store.commit('UPDATE_DATA', { index, totalCount, posts })
  },
  components: {
    post: PostComponent,
  },
  computed: {
    ...mapGetters([
      'settings',
      'data',
    ]),
    index () {
      return parseInt(this.$route.query.page) || 0
    },
    posts () {
      return (this.data && this.data.posts) || []
    },
  },
}
</script>

<style>
.post {
  margin: 4rem 0;
}
</style>
