# Pagination

Renders pagination for a given API endpoint response. This Component assumes the response will be formatted the same as Django Rest Framework's [LimitOffsetPagination](https://www.django-rest-framework.org/api-guide/pagination/#limitoffsetpagination) does.

## Installation

`npm install --save @app-elements/pagination`

## Usage

Pagination is usually used in conjuction with an API request. So, in our case, we'll rely on [withRequest](components/with-request).

```javascript
import Pagination from '@app-elements/pagination'
import withRequest from '@app-elements/with-request'

// Here's a Component that will render the results of an API request
// for a list of users. We're leaving out `UserDetail` in this example.
// But it would basically be `({ name, email }) => <div>{name} / {email}</div>`
// In this case we are assuming our Router would pass us the `pageId`:
//   {
//     users: {
//       path: '/users/:pageId',
//       component: UsersList
//     }
//   }
const UsersList = ({ pageId, isLoading, error, result }) =>
  <div>
    {isLoading && <p>Loading...</p>}
    {error != null && <strong>{error}</strong>}
    {result != null &&
      <div>
        {result.results.map(UserDetail)}
        <Pagination
          activePage={pageId}
          request={result}
          pageSize={25}
        />
      </div>
    }
  </div>

// Let's use withRequest to make a request on our API.
export default withRequest({
  endpoint: 'https://jsonplaceholder.typicode.com/users'
})(UsersList)
```

## Props

| Prop              | Type        | Default  | Description         |
|-------------------|-------------|----------|---------------------|
| **`activePage`**  | _Number_    | _None_   | The current active page. First page would be `1` not `0`
| **`pageSize`**    | _Number_    | _None_   | How many results to show per page
| **`request`**     | _Object_    | _None_   | The JSON returned from a list API endpoint formatted as [LimitOffsetPagination] (https://www.django-rest-framework.org/api-guide/pagination/#limitoffsetpagination)
