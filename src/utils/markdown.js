import Prism from 'prismjs'
import MarkdownIt from 'markdown-it'

const Markdown = MarkdownIt({
  html: true,
  breaks: false,
  highlight (str, lang) {
    try {
      Prism.languages[lang] || require(`prismjs/components/prism-${lang}`)
      const grammar = Prism.languages[lang]
      return Prism.highlight(str, grammar)
    } catch (err) {
      return str
    }
  },
})

export default Markdown
