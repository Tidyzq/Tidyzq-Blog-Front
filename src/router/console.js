import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Console/Home'
import Documents from '@/views/Console/Documents'

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
      path: '/documents',
      name: 'Documents',
      component: Documents,
    },
    { path: '*', redirect: '/' },
  ],
})
