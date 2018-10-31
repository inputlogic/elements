# Poll

Call some function every `interval` milliseconds during the lifetime of the component.

## Example

```
<Poll function={() => console.log('hello')} interval={3000} >
  {() => <h1>Hi</h1>}
</Poll>
```

## Real-word Example

```
// dispatch(invalidate('<url>')) will force <url> to be fetched again.
<Poll function={() => dispatch(invalidate('api/users'))} interval={3000} >
  <ListResource endpoint='api/messages' >
    {W.map(message => <div>{message.body}</div>)}
  </ListResource>
</Poll>
```
