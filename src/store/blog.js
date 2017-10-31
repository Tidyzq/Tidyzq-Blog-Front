import Vue from 'vue'
import Vuex from 'vuex'
import { Setting } from '@/apis'

Vue.use(Vuex)

export function createStore () {
  let fetchingSettings = null

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
    actions: {
      fetchSettings ({ commit }) {
        if (!fetchingSettings) {
          fetchingSettings = Setting.get()
            .then(({ data: settings }) => {
              fetchingSettings = null
              commit('UPDATE_SETTINGS', settings)
            })
        }
        return fetchingSettings
      },
    },
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
