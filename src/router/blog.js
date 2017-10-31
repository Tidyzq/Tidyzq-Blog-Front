import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export function createRouter () {
  return new Router({
    mode: 'history',
    base: '/blog',
    routes: [
      {
        path: '/',
        name: 'Posts',
        component: () => import('@/views/Blog/Posts'),
      }, {
        path: '/post/:url',
        name: 'PostDetail',
        component: () => import('@/views/Blog/PostDetail'),
      },
      { path: '*', redirect: '/' },
    ],
  })
}
