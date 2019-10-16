# Dropdown

Simple (P)React dropdown menus.

## Installation

`npm install --save @app-elements/dropdown`

## Usage

```javascript
import Dropdown from '@app-elements/dropdown'

<Dropdown uid='home-example'>
  <p><button onClick={ev => store.setState({modal: 'ExampleModal'})}>Open Example Modal</button></p>
  <p><button onClick={ev => showNotification({message: 'PIRATES!'})}>Pirates!</button></p>
  <p>Classy Penguin</p>
</Dropdown>
```

### Custom Trigger

```javascript
// If you provide a Component or function for the Trigger prop,
// it will be given the following props: `className='btn-dropdown' onClick={handleToggle}`
// You will need to pass these props down, so the Dropdown functionality
// works with your custom Trigger component.
<Dropdown uid='home-example' Trigger={props => <MyTrigger {...props}>Custom Trigger</MyTrigger>}>
```

## Props

| Prop                   | Type        | Default       | Description         |
|------------------------|-------------|---------------|---------------------|
| **`uid`**              | _String_    | _None_        | Unique identifier for the dropdown.
| **`buttonText`**       | _String_    | `'Select'`    | Text displayed in the default button trigger for the Dropdown.
| **`noWrapper`**        | _Boolean_   | `false`       | If `true`, will render `children` without any wrapping `div`s.
| **`Trigger`**          | _Component_ | _None_        | Any provided Component will replace the default `button` trigger.
| **`children`**         | _Array_     | _None_        | The elements to display when the Dropdown is open.
