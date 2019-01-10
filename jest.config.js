module.exports = {
  verbose: true,
  // Let babel transpile certain node_modules
  transformIgnorePatterns: [
    'node_modules/(?!(@wasmuth)/)'
  ]
}
