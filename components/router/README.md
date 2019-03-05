# Router

Provides a `<Router />` component that accepts an object definition of routes, conditionally rendering them when the URL matches their path. It also supports nested Routers and automatically wires up `<a />` elements to the router.

## Installation

`npm install --save @app-elements/router`

## Usage

```javascript
import Router from '@app-elements/router'

// import your top-level routes (details about the routes object below)
import routes from './routes'

// ...
<Router routes={routes} />
```

### routeTo

```javascript
import { routeTo } from '@app-elements/router'

routeTo('users') // `routeTo('users', true)` to use `replaceState`
```

### Defining Your Routes

```javascript
export const routes = {
  home: {
    path: '/',
    component: Home
  },
  users: {
    path: '/users',
    component: Users
  },
  user: {
    path: '/users/:id',
    component: User
  },
}
```

When a `path` is matched, the corresponding `component` will be rendered. The key for each object (_home_, _users_, _user_), is the name of the route.

### Dynamic Values From The URL

If you need to parse the data out of the URL, use a dynamic segment (they start with a `:`). The parsed value will become a prop sent to the matched component.

In the above example, `{id}` would be a prop on the `<User />` component.

### Nested Routers

If you want to group certain routes together, you can define multiple Routers. This allows you to, for instance, render a common header or navigation component for a certain grouping of routes. To nest routes, you need to define _parent_ routes. _Parent_ routes look like so:

```javascript
export default {
  marketing: {
    routes: marketingRoutes,
    component: Marketing
  },
  account: {
    routes: accountRoutes,
    component: Account
  }
}
```

You'll notice the difference is that each route object has a `routes` property instead of a `path` property. If *any* of the nested `routes` match the current URL, then that parent routes' `component` will render.

Let's say the `accountRoutes` are something like:

```javascript
export const accountRoutes = {
  login: {
    path: '/login',
    component: Login
  },
  signup: {
    path: '/signup',
    component: SignUp
  }
}
```

And the current URL is: `/signup`, then the _parent_ route `account` will match, and the `<Account />` component will render. The last step is to include a `<Router />` inside the `<Account />` component that gets passed the `accountRoutes` object. As an example, `<Account />` could look like this:

```javascript
import accountRoutes from './routes'

// If we wanted to render some navigation links on *all* account routes,
// we would render them inside this `Account` component.
import AccountNav from './AccountNav'

export const Account = () => (
  <div>
    <AccountNav />
    <Router routes={accountRoutes} />
  </div>
)
```

Now you have a top-level router that renders different components based on nested routes. Those top-level, or _parent_ route components can then include a nested `<Router />` to gain finer control over what gets rendered based on the current URL.

## Props

| Prop              | Type        | Default  | Description         |
|-------------------|-------------|----------|---------------------|
| **`routes`**      | _Object_    | _None_   | An object of objects representing the routes. Supported keys are `path`, `component`, and `routes`.
