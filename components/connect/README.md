# connect

> **deprecated** in favour of [useMappedState](../use-mapped-state) and [useRequest](../use-request)

Convenience HoC that connects withState and withRequest. Also offers a way to create actions and a reducer.

## Installation

`npm install --save @app-elements/connect`

## Usage

```javascript
import connect from '@app-elements/connect'

// Here is are view for rendering that data
const PeopleList = ({ result }) =>
  <div>
    // Do something with `result`
  </div>

// Now we use connect to wrap the PeopleList component
// in a Higher order Component (HoC) that, in this case,
// will sync state changes and perform an API request.
const enhance = connect({
  // Let's say we have another Component somewhere that let's
  // the user specify filter options for what people to display.
  withState: ({ peopleFilters }) => ({ peopleFilters }),
  withRequest: {
    // We will use the state property we accessed with `withState`
    // to modify the endpoint we want to request.
    endpoint: ({ peopleFilters }) => ({
      endpoint: `users?${qs.stringify(peopleFilters, '', true)}`
    })
  }  
})

// Since connect is a HoC, it returns a function that expects
// to be called with a Component as its only param.
export default enhance(PeopleList)
```

### withActions

A convenient way to define actions and automatically create a reducer that handles them. The reducer is only defined once and passed to the store once.

```javascript
const Dropdown = connect({
  // Each property on this object will result in a function of the same name
  // being created and included in the props given to the PassedComponent.
  withActions: {
    // Each value should be a function that accepts `(currentState, [...args])`
    // `args` will be any arguments you provide when you call the function in
    // your PassedComponent. For example, on a click handler you would call:
    // `toggle(this.props.uid)`
    toggle: ({dropdown}, uid) => {
      const isOpen = dropdown === uid
      return {dropdown: isOpen ? null : uid}
    }
  },
  
})(DropdownView)
```

## Props

| Prop                   | Type       | Default       | Description         |
|------------------------|------------|---------------|---------------------|
| **`withActions`**      | _Object_   | _None_        | An object where each child is a function that returns an object to mutate state with
| **`withState`**        | _Function_ | _None_        | A function that accepts `(state, props)` and returns an object
| **`withRequest`**      | _Object_   | _None_        | An object that accepts the props `{ endpoint, parse }`, where `endpoint` is the url to call, or a function that returns a the url to call
