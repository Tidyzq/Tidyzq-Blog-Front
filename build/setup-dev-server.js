const path = require('path')
const webpack = require('webpack')
const MemoryFs = require('memory-fs')
const devMiddleware = require('webpack-dev-middleware')
const hotMiddleware = require('webpack-hot-middleware')
const templateConfig = require('./webpack.blog.template.conf')
const clientConfig = require('./webpack.blog.client.conf')
const serverConfig = require('./webpack.blog.server.conf')
const consoleConfig = require('./webpack.console.conf')

function readFile (compiler, filepath) {
  const fs = compiler.outputFileSystem
  return fs.readFileSync(path.join(compiler.outputPath, filepath), 'utf-8')
}

module.exports = function setupDevServer (app, callback) {
  let bundle, template, clientManifest, consoleReady

  let ready
  const readyPromise = new Promise(resolve => { ready = resolve })

  const update = () => {
    if (bundle && template && clientManifest && consoleReady) {
      ready()
      callback(bundle, { template, clientManifest })
    }
  }

  const mainCompiler = webpack([ templateConfig, clientConfig, serverConfig, consoleConfig ])

  const [ templateCompiler, clientCompiler, serverCompiler, consoleCompiler ] = mainCompiler.compilers

  // const templateCompiler = webpack(templateConfig)
  // const clientCompiler = webpack(clientConfig)
  // const serverCompiler = webpack(serverConfig)
  // const consoleCompiler = webpack(consoleConfig)

  // blog template
  templateCompiler.outputFileSystem = new MemoryFs()
  templateCompiler.watch({}, (err, stats) => {
    if (err) { throw err }
    stats = stats.toJson()
    if (stats.errors.length) { return }
    template = readFile(templateCompiler, 'blog.template.html')
    update()
  })

  // blog client
  const clientDevMiddleware = devMiddleware(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    noInfo: true,
  })

  const clientHotMiddleware = hotMiddleware(clientCompiler, {
    path: '/blog/__webpack_hmr',
    log: () => {},
  })

  clientCompiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
      clientHotMiddleware.publish({ action: 'reload' })
      cb()
    })
  })

  clientCompiler.plugin('done', stats => {
    stats = stats.toJson()
    stats.errors.forEach(err => console.error(err))
    stats.warnings.forEach(err => console.warn(err))
    if (stats.errors.length) { return }
    clientManifest = JSON.parse(readFile(clientCompiler, 'vue-ssr-client-manifest.json'))
    update()
  })

  // blog server
  serverCompiler.outputFileSystem = new MemoryFs()
  serverCompiler.watch({}, (err, stats) => {
    if (err) { throw err }
    stats = stats.toJson()
    if (stats.errors.length) { return }
    bundle = JSON.parse(readFile(serverCompiler, 'vue-ssr-server-bundle.json'))
    update()
  })

  // console
  const consoleDevMiddleware = devMiddleware(consoleCompiler, {
    publicPath: consoleConfig.output.publicPath,
    noInfo: true,
  })

  const consoleHotMiddleware = hotMiddleware(consoleCompiler, {
    path: '/console/__webpack_hmr',
    log: () => {},
  })

  consoleCompiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
      consoleHotMiddleware.publish({ action: 'reload' })
      cb()
    })
  })

  consoleCompiler.plugin('done', stats => {
    stats = stats.toJson()
    stats.errors.forEach(err => console.error(err))
    stats.warnings.forEach(err => console.warn(err))
    if (stats.errors.length) { return }
    consoleReady = true
    update()
  })

  // apply middlewares
  app.use(clientDevMiddleware)
  app.use(consoleDevMiddleware)

  app.use(clientHotMiddleware)
  app.use(consoleHotMiddleware)

  return {
    readyPromise,
    readFile: readFile.bind(null, consoleCompiler),
  }
}
