module.exports = {
  verbose: false,
  // Let babel transpile certain node_modules
  transformIgnorePatterns: [
    'node_modules/(?!(@wasmuth)/)'
  ]
}
