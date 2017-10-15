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
        el-form-item
          div: el-button.block(type='warning', @click='showChangePasswordDialog = true') Change Password
        el-form-item
          div: el-button.block(type='danger', @click='onDelete') Delete User
      el-dialog(v-loading='loading', title='Change Password', v-model='showChangePasswordDialog')
        el-form(:model='pwd', :rules='pwdRules', ref='pwdForm')
          el-form-item(label='Old Password', prop='old')
            el-input(v-model='pwd.old', type='password')
          el-form-item(label='New Password', prop='new')
            el-input(v-model='pwd.new', type='password')
          el-form-item(label='Repeat New Password', prop='newRpt')
            el-input(v-model='pwd.newRpt', type='password')
        span.dialog-footer(slot='footer')
          el-button(@click='showChangePasswordDialog = false') Cancel
          el-button(type='primary', @click='onChangePassword') Confirm
    template(v-else)
      el-form
        el-form-item(label='Avatar')
          form-plain-text
            .user-detail__avatar-box
              img.user-detail__avatar(:src='user.avatar', width='100')
        el-form-item(label='Username')
          form-plain-text {{ user.username }}
        el-form-item(label='Email')
          form-plain-text {{ user.email }}
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
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
      showChangePasswordDialog: false,
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
    showChangePasswordDialog (val) {
      if (val) {
        Object.assign(this.pwd, {
          old: '',
          new: '',
          newRpt: '',
        })
      }
    },
  },
  created () {
    this.fetchData()
    this.$on('save', () => {
      this.onSave()
    })
  },
  methods: {
    ...mapActions([
      'logout',
    ]),
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
          await User.Password.update({
            userId: this.userId,
          }, {
            oldPassword: this.pwd.old,
            newPassword: this.pwd.new,
          })
          this.$message({
            type: 'success',
            message: 'Change password success!',
          })
          this.showChangePasswordDialog = false
        }
      } catch (e) {
        this.$error(e)
      }
    },
    validatePwd () {
      return new Promise(resolve => this.$refs.pwdForm.validate(resolve))
    },
    async onDelete () {
      try {
        if (await this.$comfirm('Are you sure to delete this user?', 'Delete User')) {
          await User.delete({ userId: this.userId })
          // logout and return to login page after delete
          this.logout()
          window.location.assign('/console/login')
        }
      } catch (e) {
        this.$error(e)
      }
    },
  },
}
</script>

<style scoped>
.user-detail {
  padding: 0.5rem 1rem;
  overflow: auto;
}

.user-detail__avatar-box {
  height: 10rem;
  min-width: 10rem;
  display: inline-block;
  vertical-align: top;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #bfcbd9;
  box-sizing: border-box;
  color: #1f2d3d;
  font-size: inherit;
  outline: 0;
  padding: 3px;
  transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  cursor: pointer;
}

.user-detail__avatar {
  min-width: 9.5rem;
  max-height: 9.5rem;
  vertical-align: top;
}
</style>
