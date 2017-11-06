<template lang='pug'>
  .post-detail
    navbar.post__navbar
    .post-header
      h1.post-header__title {{ title }}
      time.post-header__date {{ createdAtFormated }}
    MarkdownView.post-body(v-model='htmlBody')
</template>

<script>
import { mapGetters } from 'vuex'

import MarkdownView from '@/components/blog/MarkdownView'
import Navbar from '@/components/blog/Navbar'
import HeadMixin from '../../mixins/head'

export default {
  mixins: [
    HeadMixin,
  ],
  components: {
    Navbar,
    MarkdownView,
  },
  asyncData ({ store, route }) {
    const url = route.params.url
    return store.dispatch('fetchPost', url)
  },
  title () {
    return this.title
  },
  computed: {
    ...mapGetters([
      'settings',
      'data',
    ]),
    title () {
      return this.data.title || ''
    },
    createdAtFormated () {
      return this.data.createdAtFormated || ''
    },
    htmlBody () {
      return this.data.html || ''
    },
  },
}

</script>

<style>
.post-header {
  padding: 0 1rem;
  overflow: hidden;
}

.post-header__title {
  font-size: 3rem;
  font-weight: bold;
  color: #34495e;
  margin: 0;
}

.post-header__date {
  line-height: 2.2rem;
  color: #9eabb3;
}

.post-header, .post-body {
  margin: auto;
  max-width: 60rem;
}

</style>
