// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Blog from '../views/Blog'
import { createRouter } from '../router/blog'
import { createStore } from '../store/blog'

import 'font-awesome/css/font-awesome.css'

Vue.config.productionTip = false

export function createApp () {
  const router = createRouter()
  const store = createStore()
  const app = new Vue({
    router,
    store,
    render: h => h(Blog),
  })
  return { app, router, store }
}
