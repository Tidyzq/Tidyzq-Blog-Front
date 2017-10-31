require('./check-versions')()

const config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development'
}

const opn = require('opn')
const path = require('path')
const express = require('express')
const webpack = require('webpack')
const proxyMiddleware = require('http-proxy-middleware')
const webpackFrontConfig = require('./webpack.front.conf')
const webpackServerConfig = require('./webpack.server.conf')
const { createBundleRenderer } = require('vue-server-renderer')

// default port where dev server listens for incoming traffic
const port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
const autoOpenBrowser = Boolean(config.dev.autoOpenBrowser)
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
const proxyTable = config.dev.proxyTable || {}

const app = express()
const compiler = webpack([ webpackFrontConfig, webpackServerConfig ])

console.log(compiler.outputPath)

const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackFrontConfig.output.publicPath,
  quiet: true,
})

const hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {},
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  let options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
// app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
const staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

const router = express.Router()

const [ frontCompiler, serverCompiler ] = compiler.compilers

function sendFile (filename) {
  return function (req, res, next) {
    // compiler.outputFileSystem.readFile(path.join(compiler.outputPath, filename), (err, result) => {
    //   if (err) { return next(err) }
    //   res.set('content-type', 'text/html')
    //   res.send(result)
    //   res.end()
    // })
    const stream = frontCompiler.outputFileSystem.createReadStream(path.join(frontCompiler.outputPath, filename))
    stream.on('error', next)
    stream.pipe(res)
  }
}

router.get(/^\/blog(\/.*)?$/, (req, res, next) => {
  serverCompiler.outputFileSystem.readFile(path.join(serverCompiler.outputPath, 'vue-ssr-server-bundle.json'), (err, result) => {
    if (err) { return next(err) }
    const serverBundle = JSON.parse(result.toString())
    const renderer = createBundleRenderer(serverBundle, {})
    renderer.renderToString({ url: req.url }, (err, html) => {
      if (err) { return next(err) }
      res.end(html)
    })
  })
})

router.get('/console/login', sendFile('login.html'))

router.get(/^\/console(\/.*)?$/, sendFile('console.html'))

router.get('*', (req, res) => res.redirect('/blog'))

app.use(router)

const uri = 'http://localhost:' + port

let _resolve
const readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

const server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  },
}
