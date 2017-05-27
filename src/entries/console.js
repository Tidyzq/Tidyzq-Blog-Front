// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Console from '@/views/Console'
import router from '@/router/console'
import store from '@/store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'

import SideMenu from '@/components/SideMenu'
import Topbar from '@/components/Topbar'

Vue.config.productionTip = false

Vue.use(ElementUI)

Vue.component('side-menu', SideMenu)
Vue.component('topbar', Topbar)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render (h) { return h(Console) },
})
