require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var path = require('path')
var express = require('express')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable || {}
var routerTable = config.dev.routerTable || {}

var app = express()

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

var router = express.Router()
Object.keys(routerTable).forEach(function (routerPath) {
  var options = routerTable[routerPath]
  if (options.sendFile) {
    console.log(routerPath + ' -> sendFile("' + options.sendFile + '")');
    var filename = path.resolve(__dirname, '../dist', options.sendFile);
    router.get(routerPath, function (req, res, next) {
      res.sendFile(filename);
    });
  } else if (options.redirect) {
    console.log(routerPath + ' -> redirect("' + options.redirect + '")');
    router.get(routerPath, function (req, res, next) {
      res.redirect(options.redirect);
    });
  }
})
app.use(router)

app.use(express.static('./dist'))

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting prod server...')

var server = app.listen(port, function (err) {
  if (err) {
    console.error(err);
    return;
  }
  console.log('> Listening at ' + uri + '\n')
  _resolve()
})

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
