# useSuccessiveTaps

useSuccessiveTaps takes a number of taps, a delay, and a callback, then returns
a function that will only invoke the callback when it itself is invoked the
specified number of times (with a pause no greater than the specified delay).

## Installation

`npm install --save @app-elements/use-successive-taps`

## Usage

```javascript
import { useSuccessiveTaps } from '@app-elements/use-successive-taps'

const Stateful = (props) => {
  // Create a handler to invoke "Test" mode only after our logo is tapped 10
  times.
  const handler = useSuccessiveTaps(10, 750, () => {
    dispatch(toggleTestMode())
  })
  
  return (
    <h1 onClick={handler}>Logo</h1>
  )
}
```

## Props

| Prop                   | Type       | Default       | Description         |
|------------------------|------------|---------------|---------------------|
| **`numTaps`**          | _Number_   | _None_        | Number of successive taps
| **`delay`**            | _Number_   | _None_        | ms pause allowed between taps
| **`callback`**         | _Function_ | _None_        | function to invoke after successive taps
