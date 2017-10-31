import { createApp } from './blog'

export default function ({ url }) {
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp()
    router.push(url)
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      if (!matchedComponents.length) {
        return reject(new Error('404'))
      }
      Promise.all(matchedComponents.map(component => {
        if (component.asyncData) {
          return component.asyncData({
            store,
            route: router.currentRoute,
          })
        }
      })).then(() => {
        resolve(app)
      }, reject)
    }, reject)
  })
}
