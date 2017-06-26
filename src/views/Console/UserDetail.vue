<template lang='pug'>
  .user-detail
    portal(to='topbar')
       span Users
       span {{ userId }}
    portal(to='topbar-buttons', v-if='isSelf')
      el-button(type='success', @click='onSave') Save
    template(v-if='isSelf')
      el-form
        el-form-item(label='Avatar')
          avatar-select(v-model='avatar', :default-url='user.avatar')
        el-form-item(label='Username')
          el-input(v-model='user.username')
        el-form-item(label='Email')
          form-plain-text {{ user.email }}
      el-form(:model='pwd', :rules='pwdRules', ref='pwdForm')
        el-form-item(label='Old Password', prop='old')
          el-input(v-model='pwd.old', type='password')
        el-form-item(label='New Password', prop='new')
          el-input(v-model='pwd.new', type='password')
        el-form-item(label='Repeat New Password', prop='newRpt')
          el-input(v-model='pwd.newRpt', type='password')
        el-form-item
          div
            el-button.block(type='danger', @click='onChangePassword') Change Password
    template(v-else)
      el-form
        el-form-item(label='Avatar')
          form-plain-text
            img(:src='user.avatar', width='100')
        el-form-item(label='Username')
          form-plain-text {{ user.username }}
        el-form-item(label='Email')
          form-plain-text {{ user.email }}
</template>

<script>
import { mapGetters } from 'vuex'
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
      avatar: null,
    }
  },
  computed: {
    ...mapGetters([
      'currentUser',
    ]),
    userId () {
      return Number.parseInt(this.$route.params.userId)
    },
    isSelf () {
      return this.currentUser.id === this.userId
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
      this.onSave()
    })
  },
  methods: {
    fetchData () {
      User.get({ userId: this.userId })
        .then(({ body: user }) => {
          this.user = user
        })
    },
    onSelectAvatar (files) {
      this.upload.avatar = files[0]
      const reader = new FileReader()
      reader.onload = ev => {
        this.upload.avatarDataUrl = ev.target.result
      }
      reader.readAsDataURL(files[0])
    },
    onSave () {
      Promise.resolve()
        .then(() => {
          return this.avatar ? this.uploadAvatar() : null
        })
        .then(() => this.updateUser())
        .then(() => this.$message({
          type: 'success',
          message: 'Update User Success',
        }))
        .catch(err => this.onError(err))
    },
    onChangePassword () {
      this.$refs.pwdForm.validate(valid => {
        if (valid) {
          this.changePassword()
            .then(() => this.$message({
              type: 'success',
              message: 'Change password success!',
            }))
            .catch(err => this.onError(err))
        }
      })
    },
    uploadAvatar () {
      const formData = new FormData()
      formData.append('images', this.avatar)
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
    onError (err) {
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
