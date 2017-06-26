<template lang='pug'>
.user-page(:class=`{
    'show-list': !showDetail,
    'show-detail': showDetail
  }`)
  template(v-if='!showDetail')
    portal(to='topbar')
      span Users
    portal(to='topbar-buttons')
      el-button(type='primary', @click='showNewUserDialog = true') New
  new-user-dialog(:visiable.sync='showNewUserDialog', @created='fetchData')
  article
    .user-list(v-loading='loading')
      .user-list-item(v-for='user in users', key='user.id')
        router-link(:to=`{ name: 'UserDetail', params: { userId: user.id } }`)
          span {{ user.id }}
          span {{ user.username }}
    router-view.user-detail
</template>

<script>
import { User } from '@/apis/index'
import NewUserDialog from './NewUserDialog'

export default {
  components: {
    NewUserDialog,
  },
  data () {
    return {
      users: [],
      showNewUserDialog: false,
      loading: false,
    }
  },
  computed: {
    showDetail () {
      return this.$route.name === 'UserDetail'
    },
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.loading = true
      User.get()
        .then(({ body: users }) => {
          this.users = users
          this.loading = false
        })
    },
  },
}
</script>

<style scoped>
article {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  align-items: stretch;
}

.user-list, .user-detail {
  width: 100%;
  flex: auto;
  overflow: hidden;
}

@media only screen and (max-width: 991px) {
  .show-detail .user-list, .show-list .user-detail {
    display: none;
  }
}
</style>
