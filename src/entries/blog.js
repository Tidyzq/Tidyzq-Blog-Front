// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Blog from '../views/Blog'
import { createRouter } from '../router/blog'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'

Vue.config.productionTip = false

Vue.use(ElementUI)

export function createApp () {
  const router = createRouter()
  const app = new Vue({
    router,
    render: h => h(Blog),
  })
  return { app, router }
}
