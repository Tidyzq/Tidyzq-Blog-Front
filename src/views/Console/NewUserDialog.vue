<template lang='pug'>
  el-dialog(v-loading='loading', title='New User', v-model='_visiable')
    el-form
      el-form-item(label='Avatar')
        avatar-select(v-model='avatar')
      el-form-item(label='Username')
        el-input(placeholder='Input Username', v-model='user.username')
      el-form-item(label='Email')
        el-input(placeholder='Input Email', v-model='user.email')
      el-form-item(label='Password')
        el-input(type='password', placeholder='Input Password', v-model='user.password')
        el-input(type='password', placeholder='Repeat Password', v-model='user.rptPassword')
    span.dialog-footer(slot='footer')
      el-button(@click='_visiable = false') Cancel
      el-button(type='primary', @click='onCreate') Create
</template>

<script>
import { User, Image } from '@/apis'

export default {
  props: {
    visiable: Boolean,
  },
  data () {
    return {
      avatar: {},
      user: {},
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
        this.upload = {}
        this.user = {}
        this.loading = false
      }
    },
  },
  methods: {
    onCreate () {
      this.loading = true
      Promise.resolve()
        .then(() => {
          return this.avatar ? this.uploadAvatar() : null
        })
        .then(() => this.createUser())
        .then(() => {
          this.$emit('created')
          this.loading = false
          this._visiable = false
        })
    },
    createUser () {
      return User.save(this.user)
    },
    uploadAvatar () {
      const formData = new FormData()
      formData.append('images', this.avatar)
      return Image.save(formData)
        .then(({ body: [ avatar ]}) => {
          this.user.avatar = avatar.url
        })
    },
  },
}
</script>

<style scoped>

</style>
