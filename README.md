# InputLogic Elements

Fun!

## Documentation

- [Avatar](components/avatar)
- [Carousel](components/carousel)
- [~~connect~~](components/connect) **deprecated**
- [Dropdown](components/dropdown)
- [Form](components/form)
- [Helmet](components/helmet)
- [Image](components/image)
- [Interval](components/interval)
- [LazyLoad](components/lazy-load)
- [Level](components/level)
- [ListResource](components/list-resource)
- [LoadingIndicator](components/loading-indicator)
- [Modal](components/modal)
- [Notification](components/notification)
- [Pagination](components/pagination)
- [Router](components/router)
- [Tooltip](components/tooltip)
- [useActions](components/use-actions)
- [useMappedState](components/use-mapped-state)
- [useRequest](components/use-request)
- [~~withRequest~~](components/with-request) **deprecated**
- [~~withState~~](components/with-state) **deprecated**

*Note `connect`, `withRequest`, `withState` have been deprecated in favour of using Hooks: `useMappedState` and `useRequest`*

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
