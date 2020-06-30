module.exports = function (api) {
  api.cache(true)

  return {
    presets: [
      ['@babel/preset-env', {}],
      ['@babel/preset-react', {
        runtime: 'classic',
        pragma: 'createElement',
        pragmaFrag: 'Fragment',
        useBuiltIns: true
      }]
    ],
    plugins: [
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-transform-spread',
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-object-rest-spread',
      ['module-resolver', {
        alias: {
          react: 'preact/compat',
          '@app-elements/equal': './util/equal',
          '^@app-elements/(.+)': './components/\\1',
          '': './src'
        }
      }]
    ]
  }
}
