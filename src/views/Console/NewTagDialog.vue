<template lang='pug'>
  el-dialog(v-loading='loading', title='New Tag', v-model='_visiable')
    el-form
      el-form-item(label='Name')
        el-input(placeholder='Input Name', v-model='tag.name')
      el-form-item(label='Url')
        el-input(placeholder='Input Url', v-model='tag.url')
    span.dialog-footer(slot='footer')
      el-button(@click='_visiable = false') Cancel
      el-button(type='primary', @click='onCreate') Create
</template>

<script>
import { Tag } from '@/apis'

export default {
  props: {
    visiable: Boolean,
  },
  data () {
    return {
      tag: {},
      loading: false,
    }
  },
  computed: {
    _visiable: {
      get () {
        return this.visiable
      },
      set (val) {
        this.$emit('update:visiable', val)
      },
    },
  },
  watch: {
    visiable (val) {
      if (val) {
        this.tag = {}
        this.loading = false
      }
    },
  },
  methods: {
    onCreate () {
      this.loading = true
      Tag.save(this.tag)
        .then(() => {
          this.$emit('created')
          this.loading = false
          this._visiable = false
        })
    },
  },
}
</script>

<style scoped>

</style>
