function getPropertyHandler (property) {
  return vm => {
    const prop = vm.$options[property]
    if (prop) {
      return typeof prop === 'function'
        ? prop.call(vm)
        : prop
    }
  }
}

const getTitle = getPropertyHandler('title')

const getKeywords = getPropertyHandler('keywords')

const getDescription = getPropertyHandler('description')

const getFavicon = getPropertyHandler('favicon')

const serverHeadMixin = {
  created () {
    const title = getTitle(this)
    const keywords = getKeywords(this)
    const favicon = getFavicon(this)
    const description = getDescription(this)
    Object.assign(this.$ssrContext, {
      title,
      keywords,
      favicon,
      description,
    })
  },
}

const clientHeadMixin = {}

export default process.env.VUE_ENV === 'server' ? serverHeadMixin : clientHeadMixin
