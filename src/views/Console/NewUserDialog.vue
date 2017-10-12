<template lang='pug'>
  el-dialog(v-loading='loading', title='New User', v-model='_visiable')
    el-form
      el-form-item(label='Avatar')
        avatar-select(v-model='user.avatar')
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
import { User } from '@/apis'
import AvatarSelect from '@/components/AvatarSelect'

export default {
  components: {
    AvatarSelect,
  },
  props: {
    visiable: Boolean,
  },
  data () {
    return {
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
    async onCreate () {
      this.loading = true
      try {
        await User.save(this.user)
        this.$emit('created')
        this._visiable = false
      } catch (e) {
        this.$error(e)
      }
      this.loading = false
    },
  },
}
</script>

<style scoped>

</style>
