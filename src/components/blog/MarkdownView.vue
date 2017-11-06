<template lang='pug'>
  .markdown-view(ref='view', @scroll='onScroll', v-html='html')
</template>

<script>
import ScrollMixin from '@/mixins/scroll'

export default {
  mixins: [
    ScrollMixin,
  ],
  props: {
    value: String,
    scroll: Number,
  },
  computed: {
    html () {
      return this.value
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
    html () {
      if (this.scroll) {
        this.scrollTo(this.scroll)
      }
    },
  },
  methods: {
    getRealScroll () {
      const view = this.$refs.view
      return view.scrollTop / (view.scrollHeight - view.clientHeight)
    },
    setRealScroll (val) {
      const view = this.$refs.view
      view.scrollTop = val * (view.scrollHeight - view.clientHeight)
    },
  },
}
</script>

<style src='@/less/markdown.less' lang='less' />
