<template lang='pug'>
  .post-detail
    .post-header
      h1.post-header__title {{ title }}
      time.post-header__date {{ createdAtFormated }}
    MarkdownView.post-body(v-model='markdownBody')
</template>

<script>
import Moment from 'moment'
import { mapGetters } from 'vuex'
import { Post } from '../../apis'

import MarkdownView from '@/components/MarkdownView'

export default {
  components: {
    MarkdownView,
  },
  async asyncData ({ store, route }) {
    if (!store.state.settings) {
      await store.dispatch('fetchSettings')
    }
    const { data: post } = await Post.getByUrl(route.params.url)
    post.createdAtFormated = Moment(post.createdAt).format('YYYY/MM/DD HH:mm:ss')
    store.commit('UPDATE_DATA', post)
  },
  computed: {
    ...mapGetters([
      'settings',
      'data',
    ]),
    title () {
      return (this.data && this.data.title) || ''
    },
    createdAtFormated () {
      return (this.data && this.data.createdAtFormated) || ''
    },
    markdownBody () {
      return (this.data && this.data.markdown) || ''
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

</style>
