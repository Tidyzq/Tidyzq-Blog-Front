import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export function createStore () {
  const actions = require('./blog-actions.common').default

  if (process.env.VUE_ENV === 'server') {
    Object.assign(actions, require('./blog-actions.server').createActions())
  }

  return new Vuex.Store({
    state: {
      data: {},
      settings: null,
      // settings: {
      //   title: '',
      //   description: '',
      //   logo: '',
      //   cover: '',
      //   postPerPage: 5,
      //   navigation: [],
      // },
    },
    actions,
    mutations: {
      UPDATE_DATA (state, data) {
        state.data = data
      },
      UPDATE_SETTINGS (state, settings) {
        state.settings = settings
      },
    },
    getters: {
      data: state => state.data,
      settings: state => state.settings,
    },
  })
}
