<template lang='pug'>
  .markdown-editor
    textarea(ref='editor')
</template>

<script>
import CodeMirror from 'codemirror'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/lib/codemirror.css'

export default {
  props: {
    value: String,
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
  },
  watch: {
    value (val) {
      if (val !== this.editor.getValue()) {
        this.editor.setValue(val)
      }
    },
  },
  mounted () {
    this.editor = CodeMirror.fromTextArea(this.$refs.editor, {
      mode: 'markdown',
      value: this.value,
    })
    CodeMirror.commands.save = () => {
      this.$emit('save')
    }
    this.editor.on('change', (instance, { origin }) => {
      if (origin !== 'setValue') {
        this._value = this.editor.getValue()
      }
    })
  },
}
</script>

<style>
.markdown-editor {
  height: 100%;
}

.markdown-editor .CodeMirror {
  height: 100%;
}
</style>
