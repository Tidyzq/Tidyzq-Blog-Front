// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Login from '../views/Login'
import { createStore } from '../store/console'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'

Vue.config.productionTip = false

Vue.use(ElementUI)

export function createApp () {
  const store = createStore()
  const app = new Vue({
    store,
    render: h => h(Login),
  })
  return { app, store }
}
