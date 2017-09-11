import Vue from 'vue'
import Router from 'vue-router'
import Users from '@/views/Console/Users'
import UserDetail from '@/views/Console/UserDetail'
import Documents from '@/views/Console/Documents'
import DocumentDetail from '@/views/Console/DocumentDetail'
import Tags from '@/views/Console/Tags'
import TagDetail from '@/views/Console/TagDetail'
import DocumentEditor from '@/views/Console/DocumentEditor'
import Settings from '@/views/Console/Settings'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/console',
  routes: [
    {
      path: '/users',
      name: 'Users',
      component: Users,
      children: [
        {
          path: ':userId',
          name: 'UserDetail',
          component: UserDetail,
        },
      ],
    }, {
      path: '/documents',
      name: 'Documents',
      component: Documents,
      children: [
        {
          path: ':documentId',
          name: 'DocumentDetail',
          component: DocumentDetail,
        },
      ],
    }, {
      path: '/tags',
      name: 'Tags',
      component: Tags,
      children: [
        {
          path: ':tagId',
          name: 'TagDetail',
          component: TagDetail,
        },
      ],
    }, {
      path: '/edit',
      component: DocumentEditor,
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
      component: Settings,
    },
    { path: '*', redirect: '/documents' },
  ],
})
