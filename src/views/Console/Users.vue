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
      template(v-for='user in users')
        router-link.user-list__item(key='user.id', :to=`{ name: 'UserDetail', params: { userId: user.id } }`)
          img.user-list__avatar(:src='user.avatar')
          .user-list__username {{ user.username }}
          .user-list__detail
            .user-list__email {{ user.email }}
        .user-list__line-mod(key='user.id')
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
    async fetchData () {
      this.loading = true
      try {
        const { body: users } = await User.get()
        this.users = users
      } catch (e) {
        this.$error(e)
      }
      this.loading = false
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
  overflow: auto;
}

.user-list {
  flex: 1 2 auto;
}

.user-detail {
  flex: 2 1 auto;
}

.show-detail .user-list {
  border-right: solid 1px #cadbe6
}

@media only screen and (max-width: 991px) {
  .show-detail .user-list, .show-list .user-detail {
    display: none;
  }
}

.user-list__item {
  display: block;
  text-decoration: none;
  cursor: pointer;
  height: 3rem;
  padding: 0.5rem 1rem;
}

.user-list__line-mod {
  margin: 0 1rem;
  border-bottom: solid 1px #cadbe6;
}

.user-list__item:hover {
  background: #EAF3FD;
}

.user-list__avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  float: left;
  margin: 0 0.5rem;
}

.user-list__username {
  line-height: 2rem;
  font-size: 1.1rem;
  color: #171d25;
}

.user-list__detail {
  color: #a2a2a2;
  line-height: 1rem;
  font-size: 0.8rem;
}

.user-list__detail > * {
  display: inline;
}

.user-list__detail > * + * {
  margin-left: 0.5rem;
}

</style>
