module.exports = {
  verbose: false,
  bail: true,
  setupFiles: [
    './tests-setup.js'
  ],
  // Let babel transpile certain node_modules
  transformIgnorePatterns: [
    'node_modules/(?!(@wasmuth)/)'
  ]
}
