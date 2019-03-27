# useState

Connect a Component to specified global state changes.

## Installation

`npm install --save @app-elements/use-state`

## Usage

```javascript
import useState from '@app-elements/use-state'

// Here is a simple view that expects a `count` value
// form the global state.
const StatefulView = ({ count }) =>
  <div>
    <h1>Count: {count}</h1>
  </div>

// Now we use useState to wrap the StatefulView component
// in a Higher order Component (HoC) that will keep StatefulView
// in sync with changes to `count` in the global state.
const enhance = useState({
  // Define the portion of the global state object that
  // this Component should be synced with.
  mapper: ({ count }) => ({ count })
  // equivalent to:
  // mapper: state => {
  //   return { count: state.count }
  // }
})

// Since useState is a HoC, it returns a function that expects
// to be called with a Component as its only param.
export default enhance(StatefulView)
```

## Props

| Prop                   | Type       | Default       | Description         |
|------------------------|------------|---------------|---------------------|
| **`mapper`**           | _Function_ | _None_        | A function that accepts `(state, props)` and returns an object
