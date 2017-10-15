<template lang='pug'>
  .login-page
    el-col.login-form-wrapper(:xs='22', :sm='16', :md='12', :lg='10')
      el-form.login-form
        el-form-item
          el-input(placeholder='Email', v-model='email')
        el-form-item
          el-input(type='password', placeholder='Password', v-model='password')
        el-form-item.login-btn-wrapper
          el-button.login-btn(nativeType='submit', type='primary', @click.prevent='OnSubmit') Login
    //- particle.background
    .background
      grid
</template>

<script>
import Grid from '@/components/Grid'
import { mapActions } from 'vuex'

export default {
  components: {
    Grid,
  },
  data () {
    return {
      email: '',
      password: '',
    }
  },
  created () {
    this.checkLogin()
      .then(() => {
        // already login
        window.location.assign('/console')
      })
      .catch(() => {
        // not login
      })
  },
  methods: {
    OnSubmit () {
      this.login({
        email: this.email,
        password: this.password,
      })
        .then(() => {
          window.location.assign('/console')
        })
        .catch(err => {
          err = err && err.body ? err.body : err
          this.$message({
            message: err,
            type: 'error',
          })
        })
    },
    ...mapActions([
      'login',
      'checkLogin',
    ]),
  },
}
</script>

<style>
html, body {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}

</style>

<style scoped>

.login-page {
  height: 100%;
  width: 100%;
  position: relative;
}

.login-form-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.login-form {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 0.2rem 0.4rem #000;
}

.login-btn-wrapper {
  margin: 0;
}

.login-btn {
  width: 100%;
}

.background {
  overflow: hidden;
  width: 100%;
  height: 100%;
}

</style>
