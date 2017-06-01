<template lang='pug'>
.document-detail(v-html='html')
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
    id () {
      return this.$route.params.id
    },
    html () {
      return Markdown.render(this.markdown)
    },
  },
  watch: {
    id () {
      this.fetchData()
    },
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      Document.get({ id: this.id})
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
