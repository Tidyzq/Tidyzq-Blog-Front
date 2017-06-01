<template lang='pug'>
.editor
  topbar-item(to='topbar')
    el-input(v-model='document.title')
  topbar-item(to='topbarButtons')
    el-button(type='success', @click='saveDocument') save
  textarea(ref='editor', v-model='document.markdown')
  div(ref='pre', v-html='html')
</template>

<script>
import { Document } from '@/apis/index'
import Markdown from '@/utils/markdown'
import CodeMirror from 'codemirror'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/lib/codemirror.css'

export default {
  data () {
    return {
      document: {},
    }
  },
  computed: {
    id () {
      return this.$route.params.id
    },
    html () {
      return Markdown.render(this.document.markdown || '')
    },
  },
  created () {
    this.fetchData()
  },
  mounted () {
    this.editor = CodeMirror.fromTextArea(this.$refs.editor, {
      mode: 'markdown',
      value: this.document.markdown,
    })
    this.editor.on('change', (instance, changeObj) => {
      const { origin } = changeObj
      if (origin !== 'setValue') {
        this.$set(this.document, 'markdown', this.editor.getValue())
      }
    })
  },
  methods: {
    fetchData () {
      if (this.id) {
        Document.get({ id: this.id })
          .then(({ body: document }) => {
            this.document = document
            if (this.editor) {
              this.editor.setValue(document.markdown)
            }
          })
      }
    },
    saveDocument () {
      if (this.id) {
        Document.update({ id: this.id }, this.document)
          .then(({ body: msg }) => {
            console.log(msg)
          })
      } else {
        Document.save(this.document)
          .then(({ body: msg }) => {
            console.log(msg)
          })
      }
    },
  },
}
</script>
