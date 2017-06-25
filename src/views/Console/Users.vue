<template lang='pug'>
.user-page(:class=`{
    'show-list': !showDetail,
    'show-detail': showDetail
  }`)
  topbar-item(to='topbar')
    p
      span Users
      span(v-if='userId') {{ userId }}
  topbar-item(to='topbarButtons')
    el-button(v-if='showDetail', type='success', @click='OnSave') Save
    el-button(v-else, type='primary') Create
  article
    .user-list
      .user-list-item(v-for='user in users', key='user.id')
        router-link(:to=`{ name: 'UserDetail', params: { userId: user.id } }`)
          span {{ user.id }}
          span {{ user.username }}
    router-view.user-detail(ref='userDetail')
</template>

<script>
import { User } from '@/apis/index'

export default {
  data () {
    return {
      users: [],
    }
  },
  computed: {
    userId () {
      return this.$route.params.userId
    },
    showDetail () {
      return this.$route.name === 'UserDetail'
    },
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      User.get()
      .then(({ body: users }) => {
        this.users = users
      })
    },
    OnSave () {
      this.$refs.userDetail.$emit('save')
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
