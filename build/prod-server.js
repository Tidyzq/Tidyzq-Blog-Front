require('./check-versions')()

const config = require('../config')

process.env.NODE_ENV = 'production'

const fs = require('fs')
const path = require('path')
const express = require('express')
const proxyMiddleware = require('http-proxy-middleware')
const { createBundleRenderer } = require('vue-server-renderer')

// default port where dev server listens for incoming traffic
const port = process.env.PORT || config.publish.port
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
const proxyTable = config.dev.proxyTable || {}

const app = express()

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  let options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

app.use(express.static('./dist'))

function staticPath (filePath) {
  return path.resolve(__dirname, '../dist', filePath)
}

const blogRenderer = createBundleRenderer(require(staticPath('vue-ssr-server-bundle.json')), {
  template: fs.readFileSync(staticPath('blog.template.html'), 'utf-8'),
  clientManifest: require(staticPath('vue-ssr-client-manifest.json')),
})

const router = express.Router()

router.get(/^\/blog(\/.*)?$/, (req, res, next) => {
  const url = req.url.replace(/^\/blog\/?/, '/')
  blogRenderer.renderToString({ url }, (err, html) => {
    if (err) { return next(err) }
    res.end(html)
  })
})

router.get('/console/login', (req, res) => res.sendFile(staticPath('login.html')))

router.get(/^\/console(\/.*)?$/, (req, res) => res.sendFile(staticPath('console.html')))

router.get('/', (req, res) => res.redirect('/blog'))

app.use(router)

const uri = 'http://localhost:' + port

let _resolve
const readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting prod server...')

const server = app.listen(port, function (err) {
  if (err) {
    console.error(err)
    return
  }
  console.log('> Listening at ' + uri + '\n')
  _resolve()
})

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  },
}
