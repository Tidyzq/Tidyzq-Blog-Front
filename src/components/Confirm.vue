<template lang="pug">
  el-dialog.confirm(:title='title', :visible.sync='visible', size='tiny', :before-close='onDialogClose', :show-close='false')
    span {{ message }}
    span(slot='footer')
      el-button(@click='onCancel') Cancel
      el-button(type='primary', @click='onConfirm') Confirm
</template>

<script>
export default {
  props: {
    title: String,
    message: String,
  },
  data () {
    return {
      visible: false,
    }
  },
  created () {
    this.$on('open', () => {
      this.visible = true
    })
  },
  methods: {
    onCancel () {
      this.$emit('confirm', false)
      this.visible = false
    },
    onConfirm () {
      this.visible = false
      this.$emit('confirm', true)
    },
    onDialogClose (done) {
      this.$emit('confirm', false)
      done()
    },
  },
}
</script>

