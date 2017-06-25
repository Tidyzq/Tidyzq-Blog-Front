export function UPDATE_ACCESS_TOKEN (state, accessToken) {
  state.accessToken = accessToken
}

export function REMOVE_ACCESS_TOKEN (state) {
  state.accessToken = null
}

export function UPDATE_CURRENT_USER (state, currentUser) {
  state.currentUser = currentUser
}

export function REMOVE_CURRENT_USER (state) {
  state.currentUser = {}
}
