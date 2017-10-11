import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/console',
  routes: [
    {
      path: '/users',
      name: 'Users',
      component: r => require.ensure([], () => r(require('@/views/Console/Users'))),
      children: [
        {
          path: ':userId',
          name: 'UserDetail',
          component: r => require.ensure([], () => r(require('@/views/Console/UserDetail'))),
        },
      ],
    }, {
      path: '/documents',
      name: 'Documents',
      component: r => require.ensure([], () => r(require('@/views/Console/Documents'))),
      children: [
        {
          path: ':documentId',
          name: 'DocumentDetail',
          component: r => require.ensure([], () => r(require('@/views/Console/DocumentDetail'))),
        },
      ],
    }, {
      path: '/tags',
      name: 'Tags',
      component: r => require.ensure([], () => r(require('@/views/Console/Tags'))),
      children: [
        {
          path: ':tagId',
          name: 'TagDetail',
          component: r => require.ensure([], () => r(require('@/views/Console/TagDetail'))),
        },
      ],
    }, {
      path: '/edit',
      component: r => require.ensure([], () => r(require('@/views/Console/DocumentEditor'))),
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
      component: r => require.ensure([], () => r(require('@/views/Console/Settings'))),
    },
    { path: '*', redirect: '/documents' },
  ],
})
