export function set (key, value, session = false) {
  const storage = session ? window.sessionStorage : window.localStorage
  if (!storage) {
    return
  }
  value = JSON.stringify(value)
  storage.setItem(key, value)
}

export function get (key) {
  const localStorage = window.localStorage
  const sessionStorage = window.sessionStorage
  if (!localStorage || !sessionStorage) {
    return
  }
  let value = sessionStorage.getItem(key) || localStorage.getItem(key)
  try {
    value = JSON.parse(value)
  } catch (e) {
    remove(key)
    value = null
  }
  return value
}

export function remove (key) {
  const localStorage = window.localStorage
  const sessionStorage = window.sessionStorage
  if (!localStorage || !sessionStorage) {
    return
  }
  sessionStorage.removeItem(key)
  localStorage.removeItem(key)
}
