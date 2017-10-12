<template lang='pug'>
  .user-detail(v-loading='loading')
    portal(to='topbar')
      span Users
      span {{ userId }}
    portal(to='topbar-buttons', v-if='isSelf')
      el-button(type='success', @click='onSave') Save
    template(v-if='isSelf')
      el-form
        el-form-item(label='Avatar')
          avatar-select(v-model='user.avatar')
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
import { User } from '@/apis/index'
import FormPlainText from '@/components/FormPlainText'
import AvatarSelect from '@/components/AvatarSelect'

export default {
  components: {
    FormPlainText,
    AvatarSelect,
  },
  data () {
    return {
      user: {},
      pwd: {
        old: '',
        new: '',
        newRpt: '',
      },
      loading: false,
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
    async fetchData () {
      this.loading = true
      try {
        const { body: user } = await User.get({ userId: this.userId })
        this.user = user
      } catch (e) {
        this.$error(e)
      }
      this.loading = false
    },
    async onSave () {
      try {
        await User.update({
          userId: this.userId,
        }, {
          avatar: this.user.avatar,
          username: this.user.username,
        })
        this.$message({
          type: 'success',
          message: 'Update user Success!',
        })
      } catch (e) {
        this.$error(e)
      }
    },
    async onChangePassword () {
      try {
        if (await this.validatePwd()) {
          await this.changePassword()
          this.$message({
            type: 'success',
            message: 'Change password success!',
          })
        }
      } catch (e) {
        this.$error(e)
      }
    },
    validatePwd () {
      return new Promise(resolve => {
        this.$refs.pwdForm.validate(resolve)
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
