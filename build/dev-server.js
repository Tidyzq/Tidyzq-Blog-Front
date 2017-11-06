require('./check-versions')()

const config = require('../config')

process.env.NODE_ENV = 'development'

const opn = require('opn')
const path = require('path')
const express = require('express')
const proxyMiddleware = require('http-proxy-middleware')
const setupDevServer = require('./setup-dev-server')
const { createBundleRenderer } = require('vue-server-renderer')

const app = express()

// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
const proxyTable = config.dev.proxyTable || {}

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  let options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

let blogRenderer

const { readyPromise: devServerReady, readFile } = setupDevServer(app, (bundle, options) => {
  blogRenderer = createBundleRenderer(bundle, options)
})

// serve pure static assets
const staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

const router = express.Router()

function sendFile (filename) {
  return function (req, res, next) {
    try {
      const fileContent = readFile(filename)
      res.end(fileContent)
    } catch (err) {
      next(err)
    }
  }
}

router.get(/^\/blog(\/.*)?$/, (req, res, next) => {
  const url = req.url.replace(/^\/blog\/?/, '/')
  blogRenderer.renderToString({ url }, (err, html) => {
    if (err) { return next(err) }
    res.end(html)
  })
})

router.get('/console/login', sendFile('login.html'))

router.get(/^\/console(\/.*)?$/, sendFile('console.html'))

router.get('/', (req, res) => res.redirect('/blog'))

app.use(router)

const port = process.env.PORT || config.dev.port
const uri = 'http://localhost:' + port

let ready
const readyPromise = new Promise(resolve => { ready = resolve })

const server = app.listen(port)

console.log('> Starting dev server...')

devServerReady
  .then(() => {
    console.log('> Listening at ' + uri + '\n')
    // when env is testing, don't need open it
    if (Boolean(config.dev.autoOpenBrowser) && process.env.NODE_ENV !== 'testing') {
      opn(uri)
    }

    ready()
  })

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  },
}
