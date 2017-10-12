<template lang='pug'>
.document-detail(v-loading='loading')
  portal(to='topbar')
    span Documents
    span {{ documentId }}
  portal(to='topbar-buttons', v-if='isAuthor')
    router-link(:to=`{ name: 'DocumentEditor', params: { documentId: documentId } }`)
      el-button(type='primary') Edit
  markdown-view.preview(v-model='document.markdown')
</template>

<script>
import { mapGetters } from 'vuex'
import { User, Document } from '@/apis/index'
import MarkdownView from '@/components/MarkdownView'

export default {
  components: {
    MarkdownView,
  },
  data () {
    return {
      document: {},
      loading: false,
    }
  },
  computed: {
    ...mapGetters([
      'currentUser',
    ]),
    isAuthor () {
      return this.document.author && this.document.author.id === this.currentUser.id
    },
    documentId () {
      return this.$route.params.documentId
    },
  },
  watch: {
    documentId () {
      this.fetchData()
    },
  },
  created () {
    this.fetchData()
  },
  methods: {
    async fetchData () {
      this.loading = true
      try {
        const { body: document } = await Document.get({ documentId: this.documentId })
        const { body: author } = await User.get({ userId: document.author })
        document.author = author
        this.document = document
      } catch (e) {
        this.$error(e)
      }
      this.loading = false
    },
  },
}
</script>

<style>

</style>
