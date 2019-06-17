# Modal

Simple modals. Comes with basic overlay styling, animation, and a `<Modals />` Component for dynamically rendering the correct Modal.

## Installation

`npm install --save @app-elements/modal`

## Usage

First, you need to have a root dom node to render modals into. So inside your `<body>` add `<div id='modals' />`.

Then, you need to define at least one modal. The only requirement is that the top-level element for your Component needs to be `<Modal />`:

```javascript
import Modal from '@app-elements/modal'

const ExampleModal = () =>
  <Modal>
    <h1>Example Modal</h1>
  </Modal>

export default ExampleModal
```

Now, you need to nest your `ExampleModal` in a `<Modals />` instance:

```javascript
import { Modals } from '@app-elements/modal'
import ExampleModal from '/modals/example-modal'

const MainApp = () =>
  <div>
    <Router routes={routes} />
    <Modals>
      <ExampleModal />
    </Modals>
  </div>
```

You can nest as many modals as you wish under a `<Modals />` instance, and Modals will figure out which, if any, of the modals it should render.

To show a modal, set the name in the global state:

```javascript
import { setState } from '/store'

// 'ExampleModal' matches up with the name of the modal variable.
setState({ modal: 'ExampleModal' })
// For example, `const AnotherModal = () => <Modal>/* ... */</Modal>`
// could be opened by calling `setState({ modal: 'AnotherModal' })`
```

## `<Modal />` Props

| Prop                   | Type        | Default       | Description         |
|------------------------|-------------|---------------|---------------------|
| **`className`**        | _String_    | _None_        | A class name to be added on the `.modal-container` div
| **`hideClose`**        | _Boolean_   | _false_       | Should the modal render without a 'x' close button?  
| **`children`**         | _Array_     | _None_        | The elements to display when the Modal is open.

## `<Modals />` Props

| Prop                   | Type        | Default       | Description         |
|------------------------|-------------|---------------|---------------------|
| **`children`**         | _Array_     | _None_        | The modals to display to potentially display if their name matches `modal` key on the global store.
