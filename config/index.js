// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

var routerTable = {
  '/blog': { sendFile: 'blog.html' },
  '/blog/*': { sendFile: 'blog.html' },
  '/console': { sendFile: 'console.html' },
  '/console/login': { sendFile: 'login.html' },
  '/console/*': { sendFile: 'console.html' },
  '/': { redirect: '/blog' }
}

module.exports = {
  build: {
    env: require('./prod.env'),
    entries: {
      blog: {
        template: path.resolve(__dirname, '../src/templates/blog.template.html'),
        entry: path.resolve(__dirname, '../src/entries/blog.js'),
        filename: 'blog.html'
      },
      login: {
        template: path.resolve(__dirname, '../src/templates/login.template.html'),
        entry: path.resolve(__dirname, '../src/entries/login.js'),
        filename: 'login.html'
      },
      console: {
        template: path.resolve(__dirname, '../src/templates/console.template.html'),
        entry: path.resolve(__dirname, '../src/entries/console.js'),
        filename: 'console.html'
      }
    },
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 8081,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/api': 'http://localhost:3000',
    },
    routerTable: routerTable,
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  },
  publish: {
    env: require('./prod.env'),
    prot: 8081,
    routerTable: routerTable,
  }
}
