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
      template(v-for='document in documents')
        router-link.document-list__item(key='document.id', :to=`{ name: 'DocumentDetail', params: { documentId: document.id } }`)
          .document-list__type
            .document-list__type--draft(v-if="document.type === 'draft'") Draft
            .document-list__type--post(v-else-if="document.type === 'post'") Post
            .document-list__type--page(v-else) Page
          .document-list__title {{ document.title }}
          .document-list__detail
            .document-list__author {{ document.author.username }}
            .document-list__modifiedAt updated {{ document.modifiedAtFromNow }}
        .document-list__line-mod(key='document.id')
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
      fetchingAuthor: {},
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
          this.fetchAuthor(document.author)
            .then(({ body: author }) => Object.assign(document, { author }))
        ))
        this.formatDocumentTime(documents)
        this.documents = documents
      } catch (e) {
        this.$error(e)
      }
      this.loading = false
    },
    fetchAuthor (author) {
      // compact multiple author fetching into one
      if (!this.fetchingAuthor[author]) {
        this.fetchingAuthor[author] = User.get({ userId: author }).then(data => {
          this.fetchingAuthor[author] = undefined
          return data
        })
      }
      return this.fetchingAuthor[author]
    },
    formatDocumentTime (documents) {
      for (const document of documents) {
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
  overflow: auto;
}

.document-list {
  flex: 1 2 auto;
}

.document-detail {
  flex: 2 1 auto;
}

.show-detail .document-list {
  border-right: solid 1px #cadbe6
}

@media only screen and (max-width: 991px) {
  .show-detail .document-list, .show-list .document-detail {
    display: none;
  }
}

.document-list__item {
  display: block;
  text-decoration: none;
  cursor: pointer;
  height: 3rem;
  padding: 0.5rem 1rem;
}

.document-list__line-mod {
  margin: 0 1rem;
  border-bottom: solid 1px #cadbe6;
}

.document-list__item:hover {
  background: #EAF3FD;
}

.document-list__type {
  line-height: 3rem;
  float: left;
  width: 4rem;
  text-align: center;
}

.document-list__type--draft, .document-list__type--post, .document-list__type--page {
  display: inline-block;
  line-height: 1rem;
  padding: 0.3rem;
  width: 2.4rem;
  color: #fff;
  border-radius: 4px;
}

.document-list__type--draft {
  background: #f7ba2a;
}

.document-list__type--post {
  background: #13ce66;
}

.document-list__type--page {
  background: #50bfff;
}

.document-list__title {
  line-height: 2rem;
  font-size: 1.1rem;
  color: #171d25;
}

.document-list__detail {
  color: #a2a2a2;
  line-height: 1rem;
  font-size: 0.8rem;
}

.document-list__detail > * {
  display: inline;
}

.document-list__detail > * + * {
  margin-left: 0.5rem;
}

</style>
