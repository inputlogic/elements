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
  const { result, clear } = useRequest(store, 'https://jsonplaceholder.typicode.com/users')
  return (
    <ul>
      {result.map(({ name }) => <li>{name}</li>)}
    </ul>
  )
}
```

## Props

| Prop                   | Type       | Default       | Description         |
|------------------------|------------|---------------|---------------------|
| **`store`**            | _Object_   | _None_        | An (atom) store instance
| **`url`**              | _String_   | _None_        | A URL to GET data from
