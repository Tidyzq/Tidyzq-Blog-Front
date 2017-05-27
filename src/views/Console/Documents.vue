<template lang='pug'>
.document-page
  topbar
    p Documents
  article
    div(v-for='document in documents', key='document.id')
      p {{ document.id }}
      p {{ document.title }}
</template>

<script>
import { Document } from '@/apis/index'

export default {
  data () {
    return {
      documents: [],
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      Document.get({
        filter: {
          include: 'author',
        },
      })
        .then(({ body }) => {
          this.documents = body
        })
    },
  },
}
</script>
