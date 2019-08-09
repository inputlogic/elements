# withRequest

> **deprecated** in favour of [useRequest](../use-request)

Connect a Component to the result of an API request.

## Installation

`npm install --save @app-elements/with-request`

## Usage

```javascript
import withRequest from '@app-elements/with-request'

// Here is a view that will render the result of our API request
const User = ({ id, name, email }) =>
  <div key={`user-${id}`}>
    <h1>{name}</h1>
    <p>{email}</p>
  </div>

// Now we use withRequest to wrap the User component in a 
// Higher order Component (HoC) that will call the User Component
// with the result of the API request.
const enhance = withRequest({
  // Define the url that should be called. You can pass a string, or
  // a function that's called with `props`. In this case, we'll use a
  // function so we can get the `{ id }` prop passed down by our Router.
  // Pretend the current URL is `users/3` where `3` is the `{ id }`
  endpoint: ({ id }) => `https://jsonplaceholder.typicode.com/users/${id}`
})

// Since withRequest is a HoC, it returns a function that expects
// to be called with a Component as its only param.
export default enhance(User)
```

## Configuration

Internally, `withRequest` relies on a `makeRequest` function which is a small wrapper around [XHR](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) that returns a promise and the `xhr` reference. This allows `withRequest` to abort ongoing requests if a new one is requested. (In the future this should be swapped for [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) and [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController))

Anyway, `makeRequest` also let's you set an `apiUrl` so you can make requests with just a pathname: `auth/login` instead of `https://my-cool-api.herokuapp.com/auth/login`.

To enable this:

```javascript
import { configure } from '@app-elements/with-request/makeRequest'

configure({ apiUrl: 'https://my-cool-api.herokuapp.com' })
```

## Props

| Prop            | Type                   | Default       | Description         |
|-----------------|------------------------|---------------|---------------------|
| **`endpoint`**  | _Function_ or _String_ | _None_        | The url to call, or a function that returns a the url to call.
| **`parse`**     | _Function_             | _None_        | A function to parse the API response. If provided, will be called with the signature `(result, prevResult)` and whatever it returns will be cached as the result.
