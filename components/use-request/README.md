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

## Props

| Prop                   | Type       | Default       | Description         |
|------------------------|------------|---------------|---------------------|
| **`store`**            | _Object_   | _None_        | An (atom) store instance
| **`url`**              | _String_   | _None_        | A URL to GET data from


### Return values

| Prop                   | Type       | Description         |
|------------------------|------------|---------------------|
| **`result`**           | _JSON_     | The body returned by the request. Could be null, or a string if not a JSON endpoint.
| **`error`**            | _Error_    | If the response header is >= 400, this will contain an Error instance.
| **`isLoading`**        | _Boolean_  | `true` until either `result` or `error` is set.
| **`clear`**            | _Function_ | Call this to clear the cached result of the request.
