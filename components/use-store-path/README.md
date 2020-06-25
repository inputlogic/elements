# useStorePath

useStorePath returns the value at the given path on your store, keeps your Component synced with any changes, and provides a convenient setter to update the value.


## Installation

`npm install --save @app-elements/use-store-path`

## Usage

```javascript
import { useStorePath } from '@app-elements/use-store-path'
import createStore from 'atom'

const store = createStore([], { nested: { count: 0 } })

const Counter = (props) => {
  const [count, setCount] = useStorePath(store, 'nested.count') // Or, `['nested', 'count']` also works
  return (
    <p>Count: {count}</p>
    <button onClick={() => setCount(count + 1)}>+1</button>
  )
}
```

## Props

| Prop                 | Type           | Default       | Description         |
|----------------------|----------------|---------------|---------------------|
| **`store`**          | _Object_       | _None_        | An (atom) store instance
| **`path`**           | _String|Array_ | _None_        | A '.' delimited string, or an array, that specifies the path on the state object.

