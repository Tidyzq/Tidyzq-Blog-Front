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
  article
    markdown-editor.editor(v-model='document.markdown', @save='saveDocument', :scroll.sync='editorScroll')
    markdown-view.preview(v-model='document.markdown', :scroll.sync='editorScroll')
</template>

<script>
import { Document } from '@/apis/index'

export default {
  data () {
    return {
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
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.loading = true
      Promise.resolve()
        .then(() => {
          return this.documentId ?
            Document.get({ documentId: this.documentId })
              .then(({ body: document }) => document) :
            { title: '', markdown: '', type: 'draft' }
        })
        .then(document => {
          this.document = document
          this.loading = false
        })
    },
    saveDocument () {
      Promise.resolve()
        .then(() => {
          return this.documentId ?
            Document.update({ documentId: this.documentId }, this.document) :
            Document.save(this.document)
        })
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
