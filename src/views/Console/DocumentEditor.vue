<template lang='pug'>
.editor-page(v-loading='loading')
  portal(to='topbar')
    input(placeholder='Title', v-model='document.title')
  portal(to='topbar-buttons')
    el-button(type='text', @click='showSettings = !showSettings')
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
import MarkdownView from '@/components/MarkdownView'
import MarkdownEditor from '@/components/MarkdownEditor'

export default {
  components: {
    MarkdownView,
    MarkdownEditor,
  },
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
    this.fetchDocument()
  },
  watch: {
    showSettings (show) {
      if (show) {
        this.fetchTags()
      }
    },
  },
  methods: {
    async fetchDocument () {
      this.loading = true

      try {
        if (!this.documentId) { // new document
          this.document = {
            id: null,
            title: '',
            markdown: '',
            type: 'draft',
            tags: [],
          }

        } else { // fetch document
          const [{ body: document }, { body: tags }] = await Promise.all([
            Document.get({ documentId: this.documentId }),
            Document.Tag.get({ documentId: this.documentId }),
          ])
          document.tags = tags.map(tag => tag.id)
          this.document = document
        }
      } catch (e) {
        this.$error(e)
      }
      this.loading = false
    },
    async fetchTags () {
      const { body: tags } = await Tag.get()
      this.tags = tags
    },
    async saveDocument () {
      try {
        const data = {
          title: this.document.title,
          type: this.document.type,
          url: this.document.url,
          markdown: this.document.markdown,
        }

        if (!this.documentId) { // new document
          const { body: document } = await Document.save(data)
          await Document.Tag.update({ documentId: document.id }, this.document.tags)
        } else { // existed document
          await Promise.all([
            Document.update({ documentId: this.documentId }, data),
            Document.Tag.update({ documentId: this.documentId }, this.document.tags),
          ])
        }

        this.$message({
          type: 'success',
          message: 'Save Document Success!',
        })
      } catch (e) {
        this.$error(e)
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
