const path = require('path')
const webpack = require('webpack')
const config = require('../config')

const isProduction = process.env.NODE_ENV === 'production'

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const webpackConfig = {
  entry: {
    blog: resolve('src/templates/blog.template.html'),
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].template.js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath,
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
          }, {
            loader: 'extract-loader',
          }, {
            loader: 'html-loader',
            options: {
              minimize: isProduction,
              removeComments: false,
              collapseWhitespace: false,
            },
          },
        ],
      },
    ],
  },
  devtool: isProduction ? (config.build.productionSourceMap ? '#source-map' : false) : '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': JSON.stringify('server'),
    }),
  ],
}

module.exports = webpackConfig
