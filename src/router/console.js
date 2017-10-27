import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export function createRouter () {
  return new Router({
    mode: 'history',
    base: '/console',
    routes: [
      {
        path: '/users',
        name: 'Users',
        component: () => import('@/views/Console/Users'),
        children: [
          {
            path: ':userId',
            name: 'UserDetail',
            component: () => import('@/views/Console/UserDetail'),
          },
        ],
      }, {
        path: '/documents',
        name: 'Documents',
        component: () => import('@/views/Console/Documents'),
        children: [
          {
            path: ':documentId',
            name: 'DocumentDetail',
            component: () => import('@/views/Console/DocumentDetail'),
          },
        ],
      }, {
        path: '/tags',
        name: 'Tags',
        component: () => import('@/views/Console/Tags'),
        children: [
          {
            path: ':tagId',
            name: 'TagDetail',
            component: () => import('@/views/Console/TagDetail'),
          },
        ],
      }, {
        path: '/edit',
        component: () => import('@/views/Console/DocumentEditor'),
        children: [
          {
            path: '',
            name: 'DocumentEditorNew',
          }, {
            path: ':documentId',
            name: 'DocumentEditor',
          },
        ],
      }, {
        path: '/settings',
        name: 'Settings',
        component: () => import('@/views/Console/Settings'),
      },
      { path: '*', redirect: '/documents' },
    ],
  })
}
