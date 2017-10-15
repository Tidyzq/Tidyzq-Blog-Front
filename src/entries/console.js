// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Console from '@/views/Console'
import router from '@/router/console'
import store from '@/store'
import ElementUI from 'element-ui'
import Portal from 'portal-vue'
import 'element-ui/lib/theme-default/index.css'
import 'font-awesome/css/font-awesome.css'

import Confirm from '@/components/Confirm.js'
import Error from '@/components/Error.js'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(Portal)

Vue.prototype.$confirm = Confirm
Vue.prototype.$error = Error

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(Console),
})
