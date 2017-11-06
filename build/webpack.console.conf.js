const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

const isProduction = process.env.NODE_ENV === 'production'

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const webpackConfig = {
  entry: {
    login: (isProduction ? [] : [ './build/dev-client?console=true' ]).concat([ resolve('src/entries/login.js') ]),
    console: (isProduction ? [] : [ './build/dev-client?console=true' ]).concat([ resolve('src/entries/console.js') ]),
  },
  output: {
    path: config.build.assetsRoot,
    filename: isProduction ? utils.assetsPath('js/[name].[chunkhash].js') : '[name].js',
    publicPath: isProduction ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
    chunkFilename: isProduction ? utils.assetsPath('js/[id].[chunkhash].js') : '[id].js',
  },
  resolve: {
    extensions: [ '.js', '.vue', '.json' ],
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
    new HtmlWebpackPlugin({
      filename: 'console.html',
      template: resolve('src/templates/console.template.html'),
      inject: true,
      chunks: isProduction ? [ 'manifest', 'vendor', 'common', 'console' ] : [ 'common', 'console' ],
      minify: isProduction ? {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
      } : undefined,
      chunksSortMode: isProduction ? 'dependency' : undefined,
    }),
    new HtmlWebpackPlugin({
      filename: 'login.html',
      template: resolve('src/templates/login.template.html'),
      inject: true,
      chunks: isProduction ? [ 'manifest', 'vendor', 'common', 'login' ] : [ 'common', 'login' ],
      minify: isProduction ? {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
      } : undefined,
      chunksSortMode: isProduction ? 'dependency' : undefined,
    }),
  ],
}

if (isProduction) {
  webpackConfig.plugins.push(
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
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      },
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: [ 'vendor' ],
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: [ '.*' ],
      },
    ]),
  )
  if (config.build.bundleAnalyzerReport) {
    const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
    webpackConfig.plugins.push(new BundleAnalyzerPlugin({
      analyzerPort: 8883,
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
