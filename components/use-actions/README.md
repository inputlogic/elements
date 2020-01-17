# useActions

`useActions` let's you define actions and add their reducer to your store from a Component. It only adds the reducer if it hasn't already been added.

## Installation

`npm install --save @app-elements/use-actions`

## Usage

```javascript
import { useActions } from '@app-elements/use-actions'
import createStore from 'atom'

const store = createStore([], { dropdown: null })

function MyComponent () {
  const { toggle } = useActions(this.context.store, {
    toggle: ({ dropdown }, uid) => {
      const isOpen = dropdown != null && dropdown === uid
      return { dropdown: isOpen ? null : uid }
    }
  }, 'MyComponent')
  return (
    <div>
      <button onClick={toggle('MyDropdown')}>Toggle Dropdown</button>
    </div>
  )
}
```

## Props

| Prop                   | Type       | Default       | Description         |
|------------------------|------------|---------------|---------------------|
| **`store`**            | _Object_   | _None_        | An (atom) store instance
| **`actions`**          | _Object_   | _None_        | Your action definitions. Each key will be returned by the `useActions` call. And, each value should be a function that always accepts the current state as the first param adn returns a partial state object to be applied.
| **`componentName`**    | _String_   | _None_        | A string name for the calling component. This gets passed as a meta property to help with debugging in redux dev tools.
