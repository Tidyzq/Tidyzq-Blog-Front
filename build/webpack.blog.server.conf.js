const path = require('path')
const utils = require('./utils')
const config = require('../config')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const vueLoaderConfig = require('./vue-loader.conf')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const isProduction = process.env.NODE_ENV === 'production'

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const webpackConfig = {
  target: 'node',
  entry: {
    blog: resolve('src/entries/blog.server.js'),
  },
  output: {
    libraryTarget: 'commonjs2',
    path: config.build.assetsRoot,
    filename: '[name].server.js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath,
  },
  resolve: {
    extensions: [ '.js', 'jsx', '.ts', '.tsx', '.vue', '.json' ],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        exclude: resolve('node_modules'),
        options: {
          formatter: require('eslint-friendly-formatter'),
        },
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig,
      },
      {
        test: /\.tsx?$/,
        loader: 'tslint-loader',
        enforce: 'pre',
        exclude: resolve('node_modules'),
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 1024,
          name: utils.assetsPath('img/[name].[hash:7].[ext]'),
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 1024,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]'),
        },
      },
    ].concat(utils.styleLoaders( isProduction ?
      {
        sourceMap: config.build.productionSourceMap,
        extract: true,
      }
      : { sourceMap: config.dev.cssSourceMap })),
  },
  externals: nodeExternals({
    // 不要外置化 webpack 需要处理的依赖模块。
    // 你可以在这里添加更多的文件类型。例如，未处理 *.vue 原始文件，
    // 你还应该将修改 `global`（例如 polyfill）的依赖模块列入白名单
    whitelist: /\.css$/,
  }),
  devtool: isProduction ? (config.build.productionSourceMap ? '#source-map' : false) : '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': JSON.stringify('server'),
    }),
    new VueSSRServerPlugin(),
  ],
}

if (isProduction) {
  webpackConfig.plugins.push(
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css'),
    }),
  )
} else {
  webpackConfig.plugins.push(
    new FriendlyErrorsPlugin(),
  )
}

module.exports = webpackConfig
