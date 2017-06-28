<template lang='pug'>
  transition(
    @before-enter='handleBeforeEnter',
    @after-enter='handleAfterEnter',
    @after-leave='handleAfterLeave',
    enter-active-class='collapsing'
    leave-active-class='collapsing')
    .collapse-transition(v-show='show', :style='collapseStyle')
      .collapse-body(ref='transitionBody')
        slot
</template>

<script>
export default {
  abstract: true,
  props: {
    show: Boolean,
  },
  data () {
    return {
      animatingClientHeight: false,
      animatingZeroHeight: false,
    }
  },
  computed: {
    collapseStyle () {
      const style = {}
      if (this.animatingClientHeight) {
        style.height = `${this.$refs.transitionBody.clientHeight}px`
      }
      if (this.animatingZeroHeight) {
        style.height = '0px'
      }
      return style
    },
  },
  watch: {
    show (newVal, oldVal) {
      if (!newVal && oldVal) {
        this.handleBeforeLeave()
      }
    },
  },
  methods: {
    handleBeforeEnter () {
      this.animatingZeroHeight = true
      this.$nextTick(() => {
        this.animatingZeroHeight = false
        this.animatingClientHeight = true
      })
    },
    handleAfterEnter () {
      this.animatingClientHeight = false
      this.animatingZeroHeight = false
    },
    handleBeforeLeave () {
      this.animatingClientHeight = true
      this.$nextTick(() => {
        this.animatingClientHeight = false
        this.animatingZeroHeight = true
      })
    },
    handleAfterLeave () {
      this.animatingClientHeight = false
      this.animatingZeroHeight = false
    },
  },
}
</script>

<style scoped>
.collapse-transition, .collapse-body {
  overflow: hidden;
}

.collapsing {
  transition: all .3s ease;
}
</style>
