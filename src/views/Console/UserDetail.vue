<template lang='pug'>
  .user-detail
    el-form
      el-form-item(label='Avatar')
        file-select(@input='OnSelectAvatar', accept='image/*')
          img(:src='upload.avatarDataUrl || user.avatar', width='100')
          el-button(slot='trigger', type='primary') 上传
      el-form-item(label='Username')
        el-input(v-model='user.username')
      el-form-item(label='Email')
        el-input(v-model='user.email', disabled)
    el-form(:model='pwd', :rules='pwdRules', ref='pwdForm')
      el-form-item(label='Old Password', prop='old')
        el-input(v-model='pwd.old', type='password')
      el-form-item(label='New Password', prop='new')
        el-input(v-model='pwd.new', type='password')
      el-form-item(label='Repeat New Password', prop='newRpt')
        el-input(v-model='pwd.newRpt', type='password')
      el-form-item
        div
          el-button.block(type='danger', @click='OnChangePassword') Change Password
</template>

<script>
import { User, Image } from '@/apis/index'

export default {
  data () {
    return {
      user: {},
      pwd: {
        old: '',
        new: '',
        newRpt: '',
      },
      upload: {
        avatar: null,
        avatarDataUrl: '',
      },
    }
  },
  computed: {
    userId () {
      return this.$route.params.userId
    },
    pwdRules () {
      return {
        old: [
          { validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('Please input old Password'))
            } else {
              callback()
            }
          }, trigger: 'blur' },
        ],
        new: [
          { validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('Please input new Password'))
            } else {
              callback()
            }
          }, trigger: 'blur' },
        ],
        newRpt: [
          { validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('Please input new Password'))
            } else if (value !== this.pwd.new) {
              callback(new Error('New Passwords do not match'))
            } else {
              callback()
            }
          }, trigger: 'blur'},
        ],
      }
    },
  },
  watch: {
    userId () {
      this.fetchData()
    },
  },
  created () {
    this.fetchData()
    this.$on('save', () => {
      this.OnSave()
    })
  },
  methods: {
    fetchData () {
      User.get({ userId: this.userId })
        .then(({ body: user }) => {
          this.user = user
        })
    },
    OnSelectAvatar (files) {
      this.upload.avatar = files[0]
      const reader = new FileReader()
      reader.onload = ev => {
        this.upload.avatarDataUrl = ev.target.result
      }
      reader.readAsDataURL(files[0])
    },
    OnSave () {
      Promise.resolve()
      .then(() => {
        return this.upload.avatar ? this.uploadAvatar() : null
      })
      .then(() => this.updateUser())
      .then(() => this.$message({
        type: 'success',
        message: 'Update User Success',
      }))
      .catch(err => this.OnError(err))
    },
    OnChangePassword () {
      this.$refs.pwdForm.validate(valid => {
        if (valid) {
          this.changePassword()
          .then(() => this.$message({
            type: 'success',
            message: 'Change password success!',
          }))
          .catch(err => this.OnError(err))
        }
      })
    },
    uploadAvatar () {
      const formData = new FormData()
      formData.append('images', this.upload.avatar)
      return Image.save(formData)
        .then(({ body: [ avatar ] }) => {
          this.user.avatar = avatar.url
        })
    },
    updateUser () {
      return User.update({
        userId: this.userId,
      }, {
        avatar: this.user.avatar,
        username: this.user.username,
      })
    },
    changePassword () {
      return User.Password.update({
        userId: this.userId,
      }, {
        oldPassword: this.pwd.old,
        newPassword: this.pwd.new,
      })
    },
    OnError (err) {
      err = err && err.body ? err.body : err
      this.$message({
        message: err,
        type: 'error',
      })
    },
  },
}
</script>

<style scoped>
.user-detail {
  background: green;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
