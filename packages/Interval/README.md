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

```javascript
// dispatch(invalidate('<url>')) will force <url> to be fetched again.
<Interval function={() => dispatch(invalidate('api/users'))} interval={3000} >
  <ListResource endpoint='api/messages' >
    {W.map(message => <div>{message.body}</div>)}
  </ListResource>
</Interval>
```

## Props

| Prop                   | Type        | Default  | Description         |
|------------------------|-------------|----------|---------------------|
| **`function`**         | _Function_  | _None_   | The function to call.
| **`interval`**         | _Integer_   | _None_   | The interval in milliseconds to call the function.
