module.exports = {
  presets: [
    [ env, { modules: false } ],
    'stage-2',
  ],
  plugins: [ 'transform-runtime' ],
  comments: false,
}
