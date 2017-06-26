<template lang='pug'>
.document-detail(v-loading='loading')
  portal(to='topbar')
    span Documents
    span {{ documentId }}
  portal(to='topbar-buttons', v-if='isAuthor')
    router-link(:to=`{ name: 'DocumentEditor', params: { documentId: documentId } }`)
      el-button(type='primary') Edit
  .preview(v-html='html')
</template>

<script>
import { mapGetters } from 'vuex'
import { User, Document } from '@/apis/index'
import Markdown from '@/utils/markdown'

export default {
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
    markdown () {
      return this.document.markdown || ''
    },
    html () {
      return Markdown.render(this.markdown)
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
    fetchData () {
      this.loading = true
      Document.get({ documentId: this.documentId })
        .then(({ body: document }) =>
          User.get({ userId: document.author })
            .then(({ body: author }) => Object.assign(document, { author }))
        )
        .then(document => {
          this.document = document
          this.loading = false
        })
    },
  },
}
</script>

<style>
.document-detail {
  background: greenyellow;
}
</style>
