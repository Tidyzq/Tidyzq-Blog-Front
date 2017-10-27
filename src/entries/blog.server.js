import { createApp } from './blog'

export default function ({ url }) {
  return new Promise((resolve, reject) => {
    const { app, router } = createApp()
    router.push(url)
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      if (!matchedComponents.length) {
        return reject(new Error('404'))
      }
      resolve(app)
    }, reject)
  })
}
