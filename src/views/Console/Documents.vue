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
        el-button(type='success') Add
  article
    .document-list
      router-link.document-item(v-for='document in documents', key='document.id', :to=`{ name: 'DocumentDetail', params: { documentId: document.id } }`)
        .document-item-name
          span.document-type.document-type-draft(v-if="document.type === 'draft'") Draft
          span.document-type.document-type-post(v-else-if="document.type === 'published' && !document.isPage") Post
          span.document-type.document-type-page(v-else) Page
          span.document-title {{ document.title }}
        .document-item-detail
          span.document-author {{ document.author.username }}
          span.document-created {{ document.createdAt | fromNow }}
    router-view.document-detail
</template>

<script>
import { User, Document } from '@/apis/index'
import Moment from 'moment'
import { Observable } from 'rxjs'

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
  },
  created () {
    this.fetchData()
  },
  mounted () {
    Observable.interval(1000).subscribe(() => {
      this.$forceUpdate()
    })
  },
  methods: {
    fetchData () {
      Observable.fromPromise(Document.get())
        .pluck('body')
        .concatMap(documents => Observable.from(documents))
        .map(document =>
          Observable.fromPromise(User.get({ userId: document.author })).pluck('body')
            .map(author => Object.assign(document, { author }))
        )
        .combineAll()
        .subscribe(documents => {
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
  filters: {
    fromNow (value) {
      return Moment(value).fromNow()
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
