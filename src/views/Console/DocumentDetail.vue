<template lang='pug'>
.document-detail
  portal(to='topbar')
    span Documents
    span {{ documentId }}
  portal(to='topbar-buttons')
    router-link(:to=`{ name: 'DocumentEditor', params: { documentId: documentId } }`)
      el-button(type='primary') Edit
  .preview(v-html='html')
</template>

<script>
import { Document } from '@/apis/index'
import Markdown from '@/utils/markdown'

export default {
  data () {
    return {
      markdown: '',
    }
  },
  computed: {
    documentId () {
      return this.$route.params.documentId
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
      Document.get({ documentId: this.documentId })
        .then(({ body: { markdown } }) => {
          this.markdown = markdown
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
