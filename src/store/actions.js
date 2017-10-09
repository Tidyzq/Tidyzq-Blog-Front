import { Auth, Setting } from '@/apis'
import * as storage from './storage'

export function login ({ commit, dispatch }, user, toSession) {
  return Auth.login({
    email: user.email,
    password: user.password,
  })
    .then(({ body: { accessToken, user: currentUser } }) => {
      commit('UPDATE_ACCESS_TOKEN', accessToken)
      commit('UPDATE_CURRENT_USER', currentUser)
    })
    .then(() => dispatch('saveToStorage', toSession))
}

export function logout ({ commit, dispatch }) {
  commit('REMOVE_ACCESS_TOKEN')
  commit('REMOVE_CURRENT_USER')
  return dispatch('saveToStorage')
}

export function checkLogin ({ state, dispatch }) {
  return dispatch('readFromStorage')
    .then(() => {
      if (!state.accessToken) {
        throw new Error('not login')
      } else {
        return Auth.checkLogin()
          .catch(err => {
            return dispatch('logout')
              .then(() => { throw err })
          })
      }
    })
}

export function saveToStorage ({ state: { accessToken, currentUser} }, toSession) {
  if (accessToken && currentUser) {
    storage.set('accessToken', accessToken, toSession)
    storage.set('currentUser', currentUser, toSession)
  } else {
    storage.remove('accessToken')
    storage.remove('currentUser')
  }
  return Promise.resolve()
}

export function readFromStorage ({ commit }) {
  const accessToken = storage.get('accessToken')
  const currentUser = storage.get('currentUser')
  if (accessToken && currentUser) {
    commit('UPDATE_ACCESS_TOKEN', accessToken)
    commit('UPDATE_CURRENT_USER', currentUser)
  } else {
    commit('REMOVE_ACCESS_TOKEN')
    commit('REMOVE_CURRENT_USER')
  }
  return Promise.resolve({ accessToken, currentUser })
}

let fetchingSettings = null

export function fetchSettings ({ commit }) {
  if (!fetchingSettings) {
    fetchingSettings = Setting.get()
      .then(({ body: settings }) => {
        fetchingSettings = null
        commit('UPDATE_SETTINGS', settings)
      })
  }
  return fetchingSettings
}

export function updateSettings ({ state }) {
  return Setting.update(state.settings)
}
