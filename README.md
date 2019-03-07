# InputLogic Elements

Fun!

## Documentation

- [avatar](components/avatar)
- [carousel](components/carousel)
- [connect](components/connect)
- [dropdown](components/dropdown)
- [form](components/form)
- [helmet](components/helmet)
- [image](components/image)
- [interval](components/interval)
- [lazy-load](components/lazy-load)
- [level](components/level)
- [list-resource](components/list-resource)
- [router](components/router)
- [with-request](components/with-request)
- [with-state](components/with-state)

## Making Changes

1. Clone the repo
2. `npm install`
3. `npm run bootstrap`

## Adding a New Package

1. Copy the `_package-template` folder
2. Rename it, like `MyComponent`, and move into `/components` folder
3. Update the `name` field to match: `"@app-elements/<my-component>"`
4. Add your code to the `index.js` file and add any other files you need
5. From the root of the project run: `npm run bootstrap`


## Publishing Changes

1. `npm run changed` to see what would be published
2. `npm run publish`

More details may be needed...
