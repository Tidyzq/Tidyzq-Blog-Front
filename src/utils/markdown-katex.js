import Katex from 'katex'

function isValidDelim (state, pos) {
  let canOpen = true, canClose = true

  const max = state.posMax
  const prevChar = pos > 0 ? state.src.charCodeAt(pos - 1) : -1
  const nextChar = pos + 1 <= max ? state.src.charCodeAt(pos + 1) : -1

  if (prevChar === 0x20/* " " */ || prevChar === 0x09/* \t */ ||
    (nextChar >= 0x30/* "0" */ && nextChar <= 0x39/* "9" */)) {
    canClose = false
  }
  if (nextChar === 0x20/* " " */ || nextChar === 0x09/* \t */) {
    canOpen = false
  }

  return {
    canOpen,
    canClose,
  }
}

function math_inline(state, silent) {
  if (state.src[state.pos] !== '$') {
    return false
  }

  let res = isValidDelim(state, state.pos)
  if (!res.canOpen) {
    if (!silent) {
      state.pending += '$'
    }
    state.pos += 1
    return true
  }
}
