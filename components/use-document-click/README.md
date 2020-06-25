# useDocumentClick

useDocumentClick takes a ref and a callback. When a click (or tap) occurs, the
callback is invoked with a boolean indicating if the click happened outside of
the given ref.

Useful for closing dropdowns, modals, dialogs, etc. when the user clicks outside
of the component.

## Installation

`npm install --save @app-elements/use-document-click`

## Usage

```javascript
import { useDocumentClick } from '@app-elements/use-document-click'

const MyComponent = (props) => {
  const ref = useRef()
  useDocumentClick(ref, (isOutsideRef) => isOutsideRef && setOpen(false))
  
  return (
    <h1 ref={ref}>Hello</h1>
  )
}
```

## Props

| Prop               | Type       | Default       | Description         |
|--------------------|------------|---------------|---------------------|
| **`ref`**          | _Ref_      | _None_        | The React [ref](https://reactjs.org/docs/glossary.html#refs)
| **`callback`**     | _Function_ | _None_        | Function to invoke on document click
