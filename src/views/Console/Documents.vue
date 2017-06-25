<template lang='pug'>
.document-page(:class=`{
    'show-list': !showDetail,
    'show-detail': showDetail
  }`)
  topbar-item(to='topbar')
    span Documents
    span(v-if='showDetail') {{ documentsMap[detailId] && documentsMap[detailId].title }}
  topbar-item(to='topbarButtons')
    el-button(v-if='showDetail', type='primary', @click='toEdit(detailId)') Edit
    el-button(v-else, type='success', @click='toAdd') Add
  article
    .document-list
      router-link.document-item(v-for='document in documents', key='document.id', :to=`{ name: 'DocumentDetail', params: { documentId: document.id } }`)
        .document-item-name
          span.document-type.document-type-draft(v-if="document.type === 'draft'") Draft
          span.document-type.document-type-post(v-else-if="document.type === 'published' && !document.isPage") Post
          span.document-type.document-type-page(v-else) Page
          span.document-title {{ document.title }}
        .document-item-detail
          span.document-author {{ document.author }}
          span.document-created {{ document.createdAt }}
    router-view.document-detail
</template>

<script>
import { Document } from '@/apis/index'

export default {
  data () {
    return {
      documents: [],
    }
  },
  computed: {
    showDetail () {
      return this.$route.name === 'DocumentDetail'
    },
    detailId () {
      return this.$route.params.id
    },
    documentsMap () {
      const map = {}
      for(const document of this.documents) {
        map[document.id] = document
      }
      return map
    },
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      Document.get({
        filter: { include: 'author' },
      })
        .then(({ body: documents }) => {
          this.documents = documents
        })
    },
    toEdit (id) {
      this.$router.push({
        name: 'DocumentEditor',
        params: {
          id,
        },
      })
    },
    toAdd () {
      this.$router.push({
        name: 'DocumentEditorNew',
      })
    },
  },
}
</script>

<style scoped>
article {
  height: 100%;
}

.document-list, .document-detail {
  height: 100%;
  display: inline-block;
  vertical-align: top;
  width: 50%;
}

@media only screen and (max-width: 991px) {
  .show-detail .document-detail, .show-list .document-list {
    width: 100%;
  }

  .show-detail .document-list, .show-list .document-detail {
    display: none;
  }
}
</style>
