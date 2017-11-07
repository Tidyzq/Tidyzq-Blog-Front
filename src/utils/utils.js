export const now = typeof window !== 'undefined' && window.performance && window.performance.now
  ? window.performance.now.bind(window.performance)
  : Date.now

export function easeInOut (k) {
  return 0.5 * (1 - Math.cos(Math.PI * k))
}
