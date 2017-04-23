import Apis from '@/apis'
import * as storage from './storage'

export function login ({ commit, dispatch }, user) {
  return Apis.User.login({
    include: 'user',
  }, {
    username: user.username,
    password: user.password,
  })
  .then(({ body }) => {
    const accessToken = {
      id: body.id,
      created: body.created,
      ttl: body.ttl,
    }
    const currentUser = body.user
    commit('UPDATE_ACCESS_TOKEN', accessToken)
    commit('UPDATE_CURRENT_USER', currentUser)
  })
}

export function logout ({ commit }) {
  return Apis.User.logout()
  .then(() => {
    commit('REMOVE_ACCESS_TOKEN')
    commit('REMOVE_CURRENT_USER')
  })
}

export function saveToStorage ({ state }, toSession) {
  storage.set('accessToken', state.accessToken, toSession)
  storage.set('currentUser', state.currentUser, toSession)
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
