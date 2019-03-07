module.exports = {
  verbose: false,
  'setupFiles': [
    './tests-setup.js'
  ],
  // Let babel transpile certain node_modules
  transformIgnorePatterns: [
    'node_modules/(?!(@wasmuth)/)'
  ]
}
