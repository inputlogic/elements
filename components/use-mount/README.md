# useDocumentClick

A (P)React hook that calls a function after the component is mounted, and possibly when unmounted.

## Installation

`npm install --save @app-elements/use-mount`

## Usage

```javascript
import { useMount } from '@app-elements/use-mount'

const MyComponent = () => {
  useMount(() => alert('MOUNTED'), /* () => alert('UNMOUNTED') */)
  return null
}
```

## Props

| Prop               | Type       | Default       | Description         |
|--------------------|------------|---------------|---------------------|
| **`onMount`**      | _Function_ | _None_        | Function to invoke on component mount
| **`onUnmount`**    | _Function_ | _None_        | Function to invoke on component unmount
