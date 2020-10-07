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
const Messages = () => {
  // We will combine the results from each API response into a single array.
  // This way we can append new messages, without triggering react to re-render
  // the whole list.
  const messages = useRef([])
  
  // We'll use the last message to tell the API to return only messages posted since it.
  // If no last message, then get the initial messages response.
  const [queries, setQueries] = useState({})
 
  // The API will need to implement the `published_after` filter.
  // See: https://github.com/inputlogic/django-api-starter/blob/master/apps/cms/filters.py#L11
  const { result, isLoading } = useRequest(store, url('api.messages', { queries }))
  
  // Call this on an interval, to check for new messages.
  const fetchMessages = () => {
    const lastMsg = W.last(messages.ref)
    if (lastMsg != null && queries.published_after !== lastMsg.createdAt) {
      setQueries({ published_after: lastMsg.createdAt })
    }
  }

  return (
    <Interval function={fetchMessages} interval={3000}>
      {isLoading && <LoadingIndicator />}
      {result.results && result.results.map(({ id, body }) => <div key={`message-${id}`}>{body}</div>)}
    </Interval>
  )
}
```

## Props

| Prop                   | Type        | Default    | Description         |
|------------------------|-------------|------------|---------------------|
| **`function`**         | _Function_  | _None_     | The function to call.
| **`interval`**         | _Number_    | `3000`     | The interval in milliseconds to call the function.
