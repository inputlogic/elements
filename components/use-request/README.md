# useRequest

useRequest is a simple hook for loading data. It's efficient and caches results automatically.

## Installation

`npm install --save @app-elements/use-request`

## Usage

```javascript
import { useRequest } from '@app-elements/use-request'
import createStore from 'atom'

const store = createStore([], {})

const Users = () => {
  // return an object with the keys: result, clear
  // result is the JSON response from the given URL.
  // clear is a function to clear the cache, and reload the data from the URL.
  const { result, error, isLoading, clear } = useRequest(store, 'https://jsonplaceholder.typicode.com/users')
  if (isLoading) {
    return <div>Loading...</div>
  }
  if (error != null) {
    return <div>Error!</div>
  }
  return (
    <ul>
      {result.map(({ name }) => <li>{name}</li>)}
    </ul>
  )
}
```

### Dependent Fetching

Sometimes you need to load a request based on data from another request. Here's how you can orchestrate that:

```javascript
const { result: user } = useRequest(store, '/api/user')
const { result: projects } = useRequest(store, user != null ? `/api/user/${user.id}/projects` : null)
```

### Making a Request Without Hooks

The core request function that useRequest utilizes comes with some nice defaults that you may want to reuse outside of a hook context:

1. Sets auth headers by default
2. Uses your configured `apiUrl`
3. Safely parses server response
4. Unlike Fetch, the promise fails if the status code is `>= 400`


```javascript
import { request } from '@app-elements/use-request/request'

const { promise, xhr } = request({
  url: 'https://my-cool-api.com/resource',
  method: 'POST',
  data: {
    // ...
  }
})
```

### Request Reducer

`useRequest` also ships with an optional reducer and actions that help with
managing the cached request results. To use it, you must import the reducer and include it when creating your store.

```javascript
import { requestsReducer, actions as requestActions } from '@app-elements/use-request/reducer'

const store = createStore([requestsReducer], initialState)

// It's also convenient to export the actions from your store file:
export const clearRequest = requestActions.clearRequest
export const clearRequests = requestActions.clearRequests
export const patchListRequest = requestActions.patchListRequest
```

#### appendRequest

> appendRequest({ endpointOrUid: String, item: Object, path?: String }): FluxStandardAction

This is for appending a new item for an endpoint that represents an array of items to render, ex. `api/listings`. Say, you create a new listing, instead of getting the whole listing array from your API again, you can just append the new listing to the end of the existing array of items you have.

```javascript
appendRequest({
  endpointOrUid: '/users',
  path: '',
  item: { id: 6, name: 'Margo' }
})
```

#### clearRequest

> clearRequest(endpointOrUid: String): FluxStandardAction

Removes the matching `endpointOrUid` from the `requests` object.

```javascript
clearRequest('/api/listings')
```

#### clearRequests

> clearRequests(predicate: Function): FluxStandardAction

Filters out any `endpointOrUid`s on the `requests` object that match the predicate function.

```javascript
clearRequests(uid => uid.indexOf('listings') > -1)
```

#### patchListRequest

> patchListRequest({ endpointOrUid: String, dataToMerge: Object, matchKey?: String, path?: String }): FluxStandardAction

This is for patching an endpoint that represents an array of items to render, ex. `api/listings`. Let's say you are rendering this array of items, and then perform an update to _one_ of the items contained in that array. When you go back to view the list, it very likely contains that one item but with outdated data. You _could_ clear the entire listings request, re-rendering the whole list, but it would be much nicer to just update the one item in the listings that we know has updated. This way, the entire list isn't re-rendered, rather only the one item.

```javascript
patchListRequest({
  endpointOrUid: '/api/listings',
  dataToMerge: { id: 4, title: 'Updated title' }, // Must include the `matchKey` value. In this case, `id: 4`.
  matchKey = 'id', // Optional, defaults to 'id'.
  path = 'results' // Optional, defaults to 'results'. This matches the response shape of Django-Rest-Framework. It should be the path to the actual array data returned in the API response.
})
```

## Props

| Prop                   | Type       | Default       | Description         |
|------------------------|------------|---------------|---------------------|
| **`store`**            | _Object_   | _None_        | An (atom) store instance
| **`url`**              | _String_   | _None_        | A URL to GET data from
| **`options`**          | _Object_   | _None_        | Various options to customize your request


### Request Options

| Prop                   | Type       | Default       | Description         |
|------------------------|------------|---------------|---------------------|
| **`maxTime`**          | _Number_   | 30000              | Time (ms) to cache result
| **`uid`**              | _String_   | _None_             | A unique ID to store cached result under
| **`headers`**          | _Object_   | _None_             | Your request headers
| **`method`**           | _String_   | _None_             | Request method
| **`data`**             | _Object_   | _None_             | Data to send. Typically with POST or PATCH requests
| **`noAuth`**           | _Boolean_  | false              | Skip automatically setting the Authorization header
| **`contentType`**      | _String_   | 'application/json' | Set the Content-Type, or falsy for no Content-Type header


### Return values

| Prop                   | Type       | Description         |
|------------------------|------------|---------------------|
| **`result`**           | _JSON_     | The body returned by the request. Could be null, or a string if not a JSON endpoint.
| **`error`**            | _Error_    | If the response header is >= 400, this will contain an Error instance.
| **`isLoading`**        | _Boolean_  | `true` until either `result` or `error` is set.
| **`clear`**            | _Function_ | Call this to clear the cached result of the request.
