# useActions

`useActions` let's you define actions and add their reducer to your store from a Component. It only adds the reducer if it hasn't already been added.

## Installation

`npm install --save @app-elements/use-actions`

## Usage

```javascript
import useActions from '@app-elements/use-actions'
import createStore from 'atom'

const store = createStore([], { count: 0 })

// Here is a simple view that expects a `count` value
// form the global state.
const Stateful = (props) => {
  // `mapper` is a function that is given the entire state object from your store.
  // Your job is to return the portion of that state object that this Component
  // is concerned with.
  const mapper = ({ count }) => ({ count })
  const { count } = useActions(store, mapper)
  return (
    <p>Count: {count}</p>
  )
}
```

## Props

| Prop                   | Type       | Default       | Description         |
|------------------------|------------|---------------|---------------------|
| **`store`**            | _Object_   | _None_        | An (atom) store instance
| **`mapper`**           | _Function_ | _None_        | A function that accepts `(state)` and returns an object
