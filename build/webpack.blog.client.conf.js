const path = require('path')
const utils = require('./utils')
const config = require('../config')
const webpack = require('webpack')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const vueLoaderConfig = require('./vue-loader.conf')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

const isProduction = process.env.NODE_ENV === 'production'

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const webpackConfig = {
  entry: {
    blog: (isProduction ? [] : [ './build/dev-client?blog=true' ]).concat([ resolve('src/entries/blog.client.js') ]),
  },
  output: {
    path: config.build.assetsRoot,
    filename: isProduction ? utils.assetsPath('js/[name].[chunkhash].client.js') : '[name].client.js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath,
    chunkFilename: isProduction ? utils.assetsPath('js/[id].[chunkhash].client.js') : '[id].client.js',
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
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: resolve('node_modules'),
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
  devtool: isProduction ? (config.build.productionSourceMap ? '#source-map' : false) : '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': JSON.stringify('client'),
    }),
    // extract vendor chunks for better caching
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks (module) {
        // a module is extracted into the vendor chunk if...
        return (
          // it's inside node_modules
          /node_modules/.test(module.context) &&
          // and not a CSS file (due to extract-text-webpack-plugin limitation)
          !/\.css$/.test(module.request)
        )
      },
    }),
    // extract webpack runtime & manifest to avoid vendor chunk hash changing
    // on every build.
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
    }),
    new VueSSRClientPlugin(),
  ],
}

if (isProduction) {
  webpackConfig.plugins.push(
    // extract css into its own file
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      sourceMap: true,
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css'),
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true,
      },
    }),
  )
  if (config.build.bundleAnalyzerReport) {
    const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
    webpackConfig.plugins.push(new BundleAnalyzerPlugin({
      analyzerPort: 8881,
    }))
  }
} else {
  webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin(),
  )
}


module.exports = webpackConfig
