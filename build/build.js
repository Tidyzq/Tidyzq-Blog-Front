require('./check-versions')()

process.env.NODE_ENV = 'production'

const ora = require('ora')
const util = require('util')
const rm = util.promisify(require('rimraf'))
// const path = require('path')
const chalk = require('chalk')
const webpack = util.promisify(require('webpack'))
const config = require('../config')

const templateConfig = require('./webpack.blog.template.conf')
const clientConfig = require('./webpack.blog.client.conf')
const serverConfig = require('./webpack.blog.server.conf')
const consoleConfig = require('./webpack.console.conf')

const spinner = ora('building for production...')
spinner.start()

!async function () {
  try {
    await rm(config.build.assetsRoot)
    const stats = await webpack([ templateConfig, clientConfig, serverConfig, consoleConfig ])
    spinner.stop()
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: true,
      chunks: false,
      chunkModules: false,
    }) + '\n\n')

    console.log(chalk.cyan('  Build complete.\n'))
  } catch (err) {
    console.error(chalk.red(err))
  }
}()
