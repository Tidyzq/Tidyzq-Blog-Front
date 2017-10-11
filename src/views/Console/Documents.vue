<template lang='pug'>
.document-page(:class=`{
    'show-list': !showDetail,
    'show-detail': showDetail
  }`)
  template(v-if='!showDetail')
    portal(to='topbar')
      span Documents
    portal(to='topbar-buttons')
      router-link(:to=`{ name: 'DocumentEditorNew' }`)
        el-button(type='primary') New
  article
    .document-list(v-loading='loading')
      router-link.document-item(v-for='document in documents', key='document.id', :to=`{ name: 'DocumentDetail', params: { documentId: document.id } }`)
        .document-item-name
          span.document-type.document-type-draft(v-if="document.type === 'draft'") Draft
          span.document-type.document-type-post(v-else-if="document.type === 'published' && !document.isPage") Post
          span.document-type.document-type-page(v-else) Page
          span.document-title {{ document.title }}
        .document-item-detail
          span.document-author {{ document.author.username }}
          span.document-createdAt {{ document.createdAtFromNow }}
          span.document-modifiedAt {{ document.modifiedAtFromNow }}
    router-view.document-detail
</template>

<script>
import { User, Document } from '@/apis/index'
import Moment from 'moment'

export default {
  data () {
    return {
      documents: [],
      loading: false,
    }
  },
  computed: {
    showDetail () {
      return this.$route.name === 'DocumentDetail'
    },
  },
  created () {
    this.fetchData()
  },
  mounted () {
    this._interval = setInterval(() => {
      this.formatDocumentTime(this.documents)
    }, 1000)
  },
  beforeDestroy () {
    clearInterval(this._interval)
  },
  methods: {
    async fetchData () {
      this.loading = true
      try {
        const { body: documents } = await Document.get()
        await Promise.all(documents.map(document =>
          User.get({ userId: document.author })
            .then(({ body: author }) => Object.assign(document, { author }))
        ))
        this.formatDocumentTime(documents)
        this.documents = documents
      } catch (e) {
        this.$error(e)
      }
      this.loading = false
    },
    formatDocumentTime (documents) {
      for (const document of documents) {
        document.createdAtFromNow = Moment(document.createdAt).fromNow()
        document.modifiedAtFromNow = Moment(document.modifiedAt).fromNow()
      }
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

.document-list, .document-detail {
  width: 100%;
  flex: auto;
  overflow: hidden;
}

@media only screen and (max-width: 991px) {
  .show-detail .document-list, .show-list .document-detail {
    display: none;
  }
}
</style>
