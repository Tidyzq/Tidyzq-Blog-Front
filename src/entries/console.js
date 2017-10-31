// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Console from '../views/Console'
import { createRouter } from '../router/console'
import { createStore } from '../store/console'
import ElementUI from 'element-ui'
import Portal from 'portal-vue'
import 'element-ui/lib/theme-default/index.css'
import 'font-awesome/css/font-awesome.css'

import Confirm from '../components/Confirm.js'
import Error from '../components/Error.js'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(Portal)

Vue.prototype.$confirm = Confirm
Vue.prototype.$error = Error

export function createApp () {
  const router = createRouter()
  const store = createStore()
  const app = new Vue({
    router,
    store,
    render: h => h(Console),
  })
  return { app, router, store }
}
