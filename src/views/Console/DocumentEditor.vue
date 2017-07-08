<template lang='pug'>
.editor-page(v-loading='loading')
  portal(to='topbar')
    el-input(v-model='document.title')
  portal(to='topbar-buttons')
    el-button(@click='showSettings = !showSettings')
      i.fa.fa-cog
    el-button(type='success', @click='saveDocument') Save
  el-collapse-transition
    .settings(v-show='showSettings')
      el-form(label-width='80px')
        el-form-item(label='Type')
          el-select(v-model='document.type')
            el-option(label='Draft', value='draft')
            el-option(label='Post', value='post')
            el-option(label='Page', value='page')
        el-form-item(label='Url')
          el-input(v-model='document.url')
        el-form-item(label='Tags')
          el-select(v-model='document.tags', multiple)
            el-option(v-for='tag in tags', key='tag.id', :label='tag.name', :value='tag.id')
  article
    markdown-editor.editor(v-model='document.markdown', @save='saveDocument', :scroll.sync='editorScroll')
    markdown-view.preview(v-model='document.markdown', :scroll.sync='editorScroll')
</template>

<script>
import { Document, Tag } from '@/apis/index'

export default {
  data () {
    return {
      tags: [],
      document: {},
      showSettings: false,
      loading: false,
      editorScroll: 0,
    }
  },
  computed: {
    documentId () {
      return this.$route.params.documentId
    },
    tagsMap () {
      const map = {}
      for (const tag of this.tags) {
        map[tag.id] = tag
      }
      return map
    },
  },
  created () {
    this.fetchData()
  },
  watch: {
    showSettings (val) {
      if (val) {
        this.fetchTags()
      }
    },
  },
  methods: {
    fetchData () {
      this.loading = true
      this.fetchDocument()
        .then(() => {
          this.loading = false
        })
    },
    fetchDocument () {
      return Promise.resolve()
        .then(() => {
          return this.documentId ?
            Promise.all([
              Document.get({ documentId: this.documentId }).then(({ body: document }) => document),
              Document.Tag.get({ documentId: this.documentId }).then(({ body: tags }) => tags.map(tag => tag.id)),
            ]).then(([ document, tags ]) => Object.assign(document, { tags })) :
            { title: '', markdown: '', type: 'draft' }
        })
        .then(document => {
          this.document = document
        })
    },
    fetchTags () {
      return Tag.get()
        .then(({ body: tags }) => {
          this.tags = tags
        })
    },
    saveDocument () {
      Promise.resolve()
        .then(() => {
          const data = {
            title: this.document.title,
            type: this.document.type,
            url: this.document.url,
            markdown: this.document.markdown,
          }
          return this.documentId ?
            Document.update({ documentId: this.documentId }, data).then(({ body: document }) => document.id) :
            Document.save(data).then(({ body: document }) => document.id)
        })
        .then(id =>
          Document.Tag.update({ documentId: id }, this.document.tags),
        )
        .then(() => {
          this.$message({
            type: 'success',
            message: 'Save Success!',
          })
        })
        .catch(err => this.onError(err))
    },
    onError (err) {
      err = err && err.body ? err.body : err
      this.$message({
        message: err,
        type: 'error',
      })
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

.editor, .preview {
  width: 100%;
  flex: auto;
  overflow: hidden;
}

.preview {
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
