import Prism from 'prismjs'
import MarkdownIt from 'markdown-it'
import Katex from 'katex'
import KatexPlugin from './markdown-katex'

const Markdown = MarkdownIt({
  html: true,
  breaks: false,
  highlight (str, lang) {
    try {
      Prism.languages[lang] || require(`prismjs/components/prism-${lang}.min.js`)
      const grammar = Prism.languages[lang]
      return Prism.highlight(str, grammar)
    } catch (err) {
      return str
    }
  },
})

Markdown.use(KatexPlugin, Katex)

export default Markdown
