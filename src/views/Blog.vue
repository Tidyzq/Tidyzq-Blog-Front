<template lang='pug'>
  #app
    p(v-for='nav, i in navigation' key='i'): a(:href='nav.path') {{ nav.name }}
    router-view.main-content
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  async asyncData ({ store }) {
    await store.dispatch('fetchSettings')
  },
  computed: {
    ...mapGetters([
      'settings',
    ]),
    navigation () {
      return (this.settings && this.settings.navigation) || []
    },
  },
}
</script>

<style>
.main-content {
  max-width: 60rem;
  margin: auto;
}
</style>
