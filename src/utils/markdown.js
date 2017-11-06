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

export function parse (src, env = {}) {
  return Markdown.parse(src, env)
}

export function render (ast, env = {}) {
  return Markdown.renderer.render(ast, Markdown.options, env)
}

export function renderText (ast, env = {}) {
  let result = ''
  const { limit = 0 } = env
  for (let i = 0, len = ast.length; i < len; i++) {
    const token = ast[i]
    if (token.children) {
      result += renderText(token.children, { limit: limit ? limit - result.length : 0 })
    } else {
      result += token.content
    }
    if (limit && result.length >= limit) { break }
    if (!result.endsWith(' ')) { result += ' ' }
  }
  return result
}
