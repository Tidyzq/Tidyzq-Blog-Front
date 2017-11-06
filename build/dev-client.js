/* eslint-env browser*/
/* global __resourceQuery*/

let options = {}
if (__resourceQuery) {
  const querystring = require('querystring')
  options = querystring.parse(__resourceQuery.slice(1))
}

require('eventsource-polyfill')
let hotClient
if (options.console) {
  hotClient = require('webpack-hot-middleware/client?noInfo=true&reload=true&path=/console/__webpack_hmr')
} else {
  hotClient = require('webpack-hot-middleware/client?noInfo=true&reload=true&path=/blog/__webpack_hmr')
}

hotClient.subscribe(function (event) {
  if (event.action === 'reload') {
    window.location.reload()
  }
})
