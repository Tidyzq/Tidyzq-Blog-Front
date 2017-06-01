<template lang='pug'>
.user-page
  topbar-item(to='topbar')
    p Users
  article
    div(v-for='user in users', key='user.id')
      p {{ user.id }}
      p {{ user.username }}
</template>

<script>
import { User } from '@/apis/index'

export default {
  data () {
    return {
      users: [],
    }
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
  },
}
</script>
