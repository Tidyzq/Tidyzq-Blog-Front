// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'

import Login from '../views/Login'
import { createStore } from '../store/console'
import { bindAuthorization } from '../apis'

Vue.config.productionTip = false

Vue.use(ElementUI)

bindAuthorization(() => `JWT ${store.state.accessToken}`)

const store = createStore()
const app = new Vue({
  store,
  render: h => h(Login),
})

app.$mount('#app')
