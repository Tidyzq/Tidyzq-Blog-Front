<template lang='pug'>
.document-page
  topbar-item(to='topbar')
    p Documents
    p(v-if='showDetail') {{ documentsMap[detailId] && documentsMap[detailId].title }}
  topbar-item(to='topbarButtons')
    el-button(v-if='showDetail', type='primary', @click='toEdit(detailId)') Edit
    el-button(v-else, type='success', @click='toAdd') Add
  article
    .document-list(:class=`{ 'document-split': showDetail }`)
      router-link.document-item(v-for='document in documents', key='document.id', :to=`{ name: 'DocumentDetail', params: { id: document.id } }`)
        .document-item-name
          span.document-type.document-type-draft(v-if="document.status === 'draft'") Draft
          span.document-type.document-type-post(v-else-if="document.status === 'published' && !document.isPage") Post
          span.document-type.document-type-page(v-else) Page
          span.document-title {{ document.title }}
        .document-item-detail
          span.document-author {{ document.author.username }}
          span.document-created {{ document.createdAt }}
    router-view.document-detail.document-split
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

<style>
article {
  height: 100%;
}

.document-list, .document-detail {
  height: 100%;
  display: inline-block;
  vertical-align: top;
}

.document-split {
  width: 50%;
}
</style>
