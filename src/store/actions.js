import { Auth, Setting } from '@/apis'
import * as storage from './storage'

export async function login ({ commit, dispatch }, user, toSession) {
  const { data: { accessToken, user: currentUser } } = await Auth.login({
    email: user.email,
    password: user.password,
  })
  commit('UPDATE_ACCESS_TOKEN', accessToken)
  commit('UPDATE_CURRENT_USER', currentUser)
  dispatch('saveToStorage', toSession)
}

export function logout ({ commit, dispatch }) {
  commit('REMOVE_ACCESS_TOKEN')
  commit('REMOVE_CURRENT_USER')
  dispatch('saveToStorage')
}

export async function checkLogin ({ state, dispatch }) {
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
}

export function saveToStorage ({ state: { accessToken, currentUser} }, toSession) {
  if (accessToken && currentUser) {
    storage.set('accessToken', accessToken, toSession)
    storage.set('currentUser', currentUser, toSession)
  } else {
    storage.remove('accessToken')
    storage.remove('currentUser')
  }
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
}

let fetchingSettings = null

export function fetchSettings ({ commit }) {
  if (!fetchingSettings) {
    fetchingSettings = Setting.get()
      .then(({ data: settings }) => {
        fetchingSettings = null
        commit('UPDATE_SETTINGS', settings)
      })
  }
  return fetchingSettings
}

export function updateSettings ({ state }) {
  return Setting.update(state.settings)
}
