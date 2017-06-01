import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Console/Home'
import Users from '@/views/Console/Users'
import Documents from '@/views/Console/Documents'
import DocumentDetail from '@/views/Console/DocumentDetail'
import DocumentEditor from '@/views/Console/DocumentEditor'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/console',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    }, {
      path: '/users',
      name: 'Users',
      component: Users,
    }, {
      path: '/documents',
      name: 'Documents',
      component: Documents,
      children: [
        {
          path: ':id',
          name: 'DocumentDetail',
          component: DocumentDetail,
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
          path: ':id',
          name: 'DocumentEditor',
        },
      ],
    },
    { path: '*', redirect: '/' },
  ],
})
