<template lang='pug'>
  #app
    router-view.main-content
</template>

<script>
import { mapGetters } from 'vuex'

import HeadMixin from '../mixins/head'

export default {
  mixins: [
    HeadMixin,
  ],
  async asyncData ({ store }) {
    await store.dispatch('fetchSettings')
  },
  title () {
    return this.settings.title
  },
  description () {
    return this.settings.description
  },
  favicon () {
    return this.settings.logo
  },
  computed: {
    ...mapGetters([
      'settings',
    ]),
  },
}
</script>

<style>
html, body {
  width: 100%;
  margin: 0;
  padding: 0;
  font-family: 'Helvetica Neue',Helvetica,'PingFang SC','Hiragino Sans GB','Microsoft YaHei',SimSun,sans-serif;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
}
</style>
