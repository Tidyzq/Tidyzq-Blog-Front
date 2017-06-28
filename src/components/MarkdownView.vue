<template lang='pug'>
  .markdown-view(ref='view', @scroll='onScroll', v-html='html')
</template>

<script>
import Markdown from '@/utils/markdown'

export default {
  props: {
    value: String,
    scroll: Number,
  },
  data () {
    return {
      scrolling: false,
    }
  },
  computed: {
    html () {
      return Markdown.render(this.value || '')
    },
    _scroll: {
      get () {
        return this.scroll
      },
      set (val) {
        this.$emit('update:scroll', val)
      },
    },
  },
  watch: {
    scroll (val) {
      this.scrollTo(val)
    },
  },
  methods: {
    onScroll () {
      if (!this.scrolling) {
        const delay = 250, now = Date.now()
        if (!this._throttleScroll || this._throttleScroll + delay <= now) {
          this._throttleScroll = now
          setTimeout(() => {
            this._throttleScroll = null
            this._scroll = this.getRealScroll()
          }, delay)
        }
      }
    },
    getRealScroll () {
      const view = this.$refs.view
      return view.scrollTop / (view.scrollHeight - view.clientHeight)
    },
    setRealScroll (val) {
      const view = this.$refs.view
      view.scrollTop = val * (view.scrollHeight - view.clientHeight)
    },
    scrollTo (val) {
      const realScroll = this.getRealScroll()
      if (realScroll !== this._scroll) {
        const delay = 250, preTick = 10
        const difference = val - realScroll
        const callTimes = delay / preTick
        if (this._smoothScroll) {
          clearTimeout(this._smoothScroll)
        }
        const cbs = []
        for (let i = 1; i <= callTimes; ++i) {
          (i => {
            cbs.push(() => {
              this._smoothScroll = setTimeout(() => {
                this.setRealScroll(realScroll + difference * (i + 1) / callTimes)
                cbs[ i ]()
              }, preTick)
            })
          })(i)
        }
        cbs.push(() => {
          this._smoothScroll = setTimeout(() => {
            this.scrolling = false
          }, preTick)
        })
        this.scrolling = true
        cbs[0]()
      }
    },
  },
}
</script>

<style src='@/less/markdown.less' lang='less' />
