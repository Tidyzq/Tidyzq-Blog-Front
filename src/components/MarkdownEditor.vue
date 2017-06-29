<template lang='pug'>
  .markdown-editor
    textarea(ref='editor')
</template>

<script>
import CodeMirror from 'codemirror'
import 'codemirror/mode/markdown/markdown'
import ScrollMixin from '@/mixins/scroll'
import { Image } from '@/apis'

const CodeMirrorSettings = {
  mode: 'markdown',
  indentWithTabs: false,
  lineWrapping: true,
  lineNumbers: true,
  value: this.value,
  dragDrop: true,
  allowDropFileTypes: [ 'image/png', 'image/jpeg', 'image/gif' ],
}

export default {
  mixins: [
    ScrollMixin,
  ],
  props: {
    value: String,
    scroll: Number,
  },
  computed: {
    _value: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      },
    },
    _scroll: {
      get () {
        return this.scroll
      },
      set (val) {
        this.$emit('update:scroll', val)
      },
    },
  },
  watch: {
    value (val) {
      if (val !== this.editor.getValue()) {
        this.editor.setValue(val)
      }
    },
    scroll (val) {
      this.scrollTo(val)
    },
  },
  mounted () {
    this.editor = CodeMirror.fromTextArea(this.$refs.editor, CodeMirrorSettings)
    CodeMirror.commands.save = () => {
      this.$emit('save')
    }
    this.editor.on('change', (instance, { origin }) => {
      if (origin !== 'setValue') {
        this._value = this.editor.getValue()
      }
    })
    this.editor.on('scroll', this.onScroll.bind(this))
    this.editor.on('drop', this.onDrop.bind(this))
  },
  methods: {
    getRealScroll () {
      const { top, height, clientHeight } = this.editor.getScrollInfo()
      return top / (height - clientHeight)
    },
    setRealScroll (val) {
      const { height, clientHeight } = this.editor.getScrollInfo()
      this.editor.scrollTo(0, val * (height - clientHeight))
    },
    onDrop (instance, event) {
      event.preventDefault()
      const dataTransfer = event.dataTransfer
      Promise.resolve()
        .then(() => {
          return dataTransfer.items ?
            Array.prototype.map.call(dataTransfer.items, (item => item.getAsFile())) :
            dataTransfer.files
        })
        .then(files =>
          files.reduce((formData, file) => {
            formData.append('images', file)
            return formData
          }, new FormData())
        )
        .then(formData => Image.save(formData).then(({ body: images }) => images))
        .then(images =>
          images.map(({ key, url }) => `![${key}](${url})`).join('\n')
        )
        .then(text => {
          const cursor = instance.getCursor()
          instance.replaceRange(text, cursor, cursor)
        })
    },
  },
}
</script>

<style scoped>
.markdown-editor {
  height: 100%;
}
</style>

<style>
.markdown-editor .CodeMirror {
  height: 100%;
  font-size: 16px;
  line-height: 19px;
  font-family: Consolas, Monaco,"Microsoft YaHei","微软雅黑",Arial,sans-serif;
}
</style>

<style src='codemirror/lib/codemirror.css' />