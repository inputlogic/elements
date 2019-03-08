# ListResource

A Component that will request data from an endpoint and then render each item in response `results` array. This Component assumes the `endpoint` will point to a Django-Rest-Framework powered API using [LimitOffsetPagination](https://www.django-rest-framework.org/api-guide/pagination/#limitoffsetpagination). Or, an API with similar JSON output.

## Installation

`npm install --save @app-elements/list-resource`

## Usage

```javascript
import ListResource from '@app-elements/list-resource'

const UserItem = ({ id, name, email }) =>
  <div class='user-item'>
    <h2><a href={`/users/${id}`}>{name}</a></h2>
    <p>{email}</p>
  </div>

const Users = () =>
  <ListResource
    endpoint='https://jsonplaceholder.typicode.com/users'
    limit={10}
    render={UserItem}
  />

export default Users
```

There is also a named export for rendering a single resource rather than a list.

```javascript
import { Resource } from '@app-elements/list-resource'

const UserDetails = ({ id, name, email }) =>
  <div>
    <h1>{name}</h1>
    <p>{email}</p>
    <p><a href='/users'>&larr; Back to all Users</a></p>
  </div>

// `id` is passed as a prop from Router, representing the page id we are on:
// `/users/:id`
const User = ({ id }) =>
  <div key={`user-${id}`}>
    <Resource
      endpoint={`https://jsonplaceholder.typicode.com/users/${id}`}
      render={UserDetails}
      id={id}
    />
    {parseInt(id, 10) < 10 &&
      <a href={`/users/${parseInt(id, 10) + 1}`}>Next</a>
    }
  </div>

export default User
```

## Props

| Prop             | Type        | Default       | Description         |
|----------------- |-------------|---------------|---------------------|
| **`endpoint`**   | _String_    | _None_        | The url to call
| **`limit`**      | _Number_    | _None_        | A convenience prop for setting `?limit=${limit}` on the `endpoint` url
| **`render`**     | _Component_ | _None_        | The Component to render for each item in the response `results` array
| **`pagination`** | _Boolean_   | `false`       | Should ListResource also render a `<Pagination />` component?
