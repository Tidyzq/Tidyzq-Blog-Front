import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource)

Vue.http.interceptors.push((request, next) => {
  const store = require('@/store').default
  if (store.state.accessToken) {
    request.headers.set('Authorization', `JWT ${store.state.accessToken}`)
  }
  next()
})

export const Auth = Vue.resource('/api/auth', {}, {
  login: {
    method: 'POST',
    url: '/api/auth/login',
  },
  checkLogin: {
    method: 'GET',
    url: '/api/auth/check-login',
  },
})

export const User = Object.assign(Vue.resource('/api/users{/userId}'), {
  Password: Vue.resource('/api/users{/userId}/password'),
  Post: Vue.resource('/api/users{/userId}/posts'),
})

export const Document = Object.assign(Vue.resource('/api/documents{/documentId}'), {
  Tag: Vue.resource('/api/documents{/documentId}/tags{/tagId}'),
})

export const Tag = {
  Id: Object.assign(Vue.resource('/api/tags/id{/tagId}'), {
    Document: Vue.resource('/api/tags/id{/tagId}/documents'),
  }),
  Url: Object.assign(Vue.resource('/api/tags/url{/tagUrl}'), {
    Post: Vue.resource('/api/tags/url{/tagUrl}/posts'),
  }),
}

export const Post = Object.assign(Vue.resource('/api/posts{/postUrl}'), {
  Tag: Vue.resource('/api/posts{/postUrl}/tags'),
})

export const Page = Vue.resource('/api/pages{/pageUrl}')

export const Image = Vue.resource('/api/images')
