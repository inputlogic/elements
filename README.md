# InputLogic Elements

Fun!

## Adding a new package

1. `mkdir packages/<MyComponent>`
2. `cd packages/<MyComponent> && npm init -y`
3. Update the `name` field to match: `"@app-elements/<mycomponent>"`
4. Add an `index.js` with the code, and any other package-level files
5. `cd ../../ && npm run bootstrap`


## Publishing Changes

1. `node_modules/.bin/lerna publish`
2. If a new package has been created, it will fail to publish to NPM.
3. cd to that packages dir, and run `npm publish --access public`

More details may be needed...
