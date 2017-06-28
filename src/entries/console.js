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

import SideMenu from '@/components/SideMenu'
import Topbar from '@/components/Topbar'
import FileSelect from '@/components/FileSelect'
import AvatarSelect from '@/components/AvatarSelect'
import FormPlainText from '@/components/FormPlainText'
import MarkdownEditor from '@/components/MarkdownEditor'
import CollapseTransition from '@/components/CollapseTransition'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(Portal)

Vue.component('side-menu', SideMenu)
Vue.component('topbar', Topbar)
Vue.component('file-select', FileSelect)
Vue.component('avatar-select', AvatarSelect)
Vue.component('form-plain-text', FormPlainText)
Vue.component('markdown-editor', MarkdownEditor)
Vue.component('collapse-transition', CollapseTransition)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render (h) { return h(Console) },
})
