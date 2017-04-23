import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource)

Vue.http.interceptors.push((request, next) => {
  const store = require('@/store').default
  if (store.state.accessToken) {
    request.headers.set('Authorization', `Bearer ${store.state.accessToken.id}`)
  }
  next()
})

const User = Vue.resource('/api/users{/id}', {}, {
  login: {
    method: 'POST',
    url: '/api/users/login',
  },
  logout: {
    method: 'POST',
    url: '/api/users/login',
  },
})

const Document = Vue.resource('/api/documents{/id}')

export default {
  User,
  Document,
}
