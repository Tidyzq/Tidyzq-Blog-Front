import Vue from 'vue'
import Vuex from 'vuex'
import { Auth, Setting } from '@/apis'
import * as storage from './storage'

Vue.use(Vuex)

export function createStore () {
  let fetchingSettings = null

  return new Vuex.Store({
    state: {
      accessToken: null,
      currentUser: {},
      settings: {
        title: '',
        description: '',
        logo: '',
        cover: '',
        postPerPage: 5,
        navigation: [],
      },
    },
    mutations: {
      UPDATE_ACCESS_TOKEN (state, accessToken) {
        state.accessToken = accessToken
      },
      REMOVE_ACCESS_TOKEN (state) {
        state.accessToken = null
      },
      UPDATE_CURRENT_USER (state, currentUser) {
        state.currentUser = currentUser
      },
      REMOVE_CURRENT_USER (state) {
        state.currentUser = {}
      },
      UPDATE_SETTINGS (state, settings) {
        Object.assign(state.settings, settings)
      },
    },
    actions: {
      async login ({ commit, dispatch }, user, toSession) {
        const { data: { accessToken, user: currentUser } } = await Auth.login({
          email: user.email,
          password: user.password,
        })
        commit('UPDATE_ACCESS_TOKEN', accessToken)
        commit('UPDATE_CURRENT_USER', currentUser)
        dispatch('saveToStorage', toSession)
      },

      logout ({ commit, dispatch }) {
        commit('REMOVE_ACCESS_TOKEN')
        commit('REMOVE_CURRENT_USER')
        dispatch('saveToStorage')
      },
      async checkLogin ({ state, dispatch }) {
        dispatch('readFromStorage')
        if (!state.accessToken) {
          throw new Error('not login')
        } else {
          try {
            await Auth.checkLogin()
          } catch (e) {
            dispatch('logout')
            throw e
          }
        }
      },
      saveToStorage ({ state: { accessToken, currentUser} }, toSession) {
        if (accessToken && currentUser) {
          storage.set('accessToken', accessToken, toSession)
          storage.set('currentUser', currentUser, toSession)
        } else {
          storage.remove('accessToken')
          storage.remove('currentUser')
        }
      },
      readFromStorage ({ commit }) {
        const accessToken = storage.get('accessToken')
        const currentUser = storage.get('currentUser')
        if (accessToken && currentUser) {
          commit('UPDATE_ACCESS_TOKEN', accessToken)
          commit('UPDATE_CURRENT_USER', currentUser)
        } else {
          commit('REMOVE_ACCESS_TOKEN')
          commit('REMOVE_CURRENT_USER')
        }
      },
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
      updateSettings ({ state }) {
        return Setting.update(state.settings)
      },
    },
    getters: {
      accessToken: state => state.accessToken,
      currentUser: state => state.currentUser,
      settings: state => state.settings,
    },
  })
}
