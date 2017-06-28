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
    scroll: Number,
  },
  data () {
    return {
      scrolling: false,
    }
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
    this.editor.on('scroll', () => {
      this.onScroll()
    })
  },
  methods: {
    onScroll () {
      if (!this.scrolling && this.getRealScroll() !== this._scroll) {
        const delay = 250, now = Date.now()
        if (!this._throttleScroll || this._throttleScroll + delay <= now) {
          this._throttleScroll = now
          setTimeout(() => {
            this._throttleScroll = null
            this._scroll = this.getRealScroll()
          }, delay)
        }
      }
    },
    getRealScroll () {
      const { top, height, clientHeight } = this.editor.getScrollInfo()
      return top / (height - clientHeight)
    },
    setRealScroll (val) {
      const { height, clientHeight } = this.editor.getScrollInfo()
      this.editor.scrollTo(0, val * (height - clientHeight))
    },
    scrollTo (val) {
      const realScroll = this.getRealScroll()
      if (realScroll !== this._scroll) {
        const delay = 250, preTick = 10
        const difference = val - realScroll
        const callTimes = delay / preTick
        if (this._smoothScroll) {
          clearTimeout(this._smoothScroll)
        }
        const cbs = []
        for (let i = 1; i <= callTimes; ++i) {
          (i => {
            cbs.push(() => {
              this._smoothScroll = setTimeout(() => {
                this.setRealScroll(realScroll + difference * (i + 1) / callTimes)
                cbs[ i ]()
              }, preTick)
            })
          })(i)
        }
        cbs.push(() => {
          this._smoothScroll = setTimeout(() => {
            this.scrolling = false
          }, preTick)
        })
        this.scrolling = true
        cbs[0]()
      }
    },
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