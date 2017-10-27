import { createApp } from './console'
import { bindAuthorization } from '../apis'

const { app, store } = createApp()

bindAuthorization(() => `JWT ${store.state.accessToken}`)

app.$mount('#app')
