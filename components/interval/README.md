# Interval

Call some function every `interval` milliseconds during the lifetime of the component.

## Installation

`npm install --save @app-elements/image`

## Usage

```javascript
import Interval from '@app-elements/interval'

<Interval function={() => console.log('hello')} interval={3000} >
  <h1>Hi</h1>
</Interval>
```

### Real-word Example

Very crude example, where all messages are hidden while fetching new ones:

```javascript
// Inside a component using useRequest hook
const { result, clear, isLoading } = useRequest(store, 'api/messages')

return (
  <Interval function={() => clear()} interval={3000}>
    {isLoading && <div>Loading...</div>}
    {result.results && result.results.map(message => <div>{message.body}</div>)}
  </Interval>
)
```

## Props

| Prop                   | Type        | Default    | Description         |
|------------------------|-------------|------------|---------------------|
| **`function`**         | _Function_  | _None_     | The function to call.
| **`interval`**         | _Number_    | `3000`     | The interval in milliseconds to call the function.
