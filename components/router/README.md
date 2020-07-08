# Router

Provides a `<Router />` component that accepts an object definition of routes, conditionally rendering them when the URL matches their path. It also supports nested Routers, a `<Link />` component, and a `useRouter` hook to interact with the router.

**Related components/hooks**

- [StackRouter](#stackrouter)
- [Link](#link)
- [RouteTo](#routeto)
- [SyncRouterState](#syncrouterstate)
- [useRouter](#userouter)
- [useScrollToTop](#usescrolltotop)

## Installation

`npm install --save @app-elements/router`

## Usage

```javascript
import { RouteProvider, Router } from '@app-elements/router'

// import your top-level routes (details about the routes object below)
import routes from './routes'

// ...
// The RouteProvider and top-most Router should both be provided the same
// top-level routes object.
<RouteProvider routes={routes}>
  <Router routes={routes} />
</RouteProvider>
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

## Router Props

| Prop              | Type        | Default  | Description         |
|-------------------|-------------|----------|---------------------|
| **`routes`**      | _Object_    | _None_   | An object of objects representing the routes. Supported keys are `path`, `component`, and `routes`.


# StackRouter

`<StackRouter />` builds on `<Router />` by maintaining a "stack" or history of the rendered components, and exposing that stack to a [Function as Child](https://medium.com/merrickchristensen/function-as-child-components-5f3920a9ace9). From there you can determine how you want to manage or render the stack. For instance, by wrapping the current active component/route in the stack with `react-transition-group` components, you can easily add animations to your route transitions.

```javascript
import { StackRouter } from '@app-elements/router'
import { CSSTransition, TransitionGroup } from "react-transition-group"

// ...
  {/*
    The current active route is always the last in the `stack`
    array. In this case, we are going to limit the stack to only
    hold 1 route, and just utilize the function as child pattern,
    so we can wrap the route component with a TransitionGroup.
  */}
  <StackRouter routes={routes}>
    {({ stack, limit = 1 }) => {
      const { path, args, isBack, Component } = stack[stack.length - 1]
      return (
        <TransitionGroup className="stack">
          <CSSTransition
            key={path}
            classNames={isBack ? "fade-reverse" : "fade"}
            addEndListener={(node, done) => {
              node.addEventListener("transitionend", done, false)
            }}
          >
            <div className='page'>
              <Component {...args} />
            </div>
          </CSSTransition>
        </TransitionGroup>
      )
    }}
  </StackRouter>
```


# Link

```javascript
import { Link } from '@app-elements/router'

// Render an anchor with a named route
return <Link to='post' args={{ id: post.id }}>{post.title}</Link>
```


# RouteTo

```javascript
import { RouteTo } from '@app-elements/router'

// In your component (perhaps when a form success state is reached) 
// you can render RouteTo to route to a new URL.
return <RouteTo name='blogPost' args={{ id }} />
```

## Link and RouteTo Props

| Prop              | Type        | Default  | Description         |
|-------------------|-------------|----------|---------------------|
| **`to`**          | _String_    | _None_   | String that matches a key in your routes object.
| **`name`**        | _String_    | _None_   | Same as `to`, for backwards compatibility/preference.
| **`args`**        | _Object_    | _None_   | Object of key-value pairs to replace dynamic values in a route definition. Ex. `posts/:id` => { id: 1 }
| **`queries`**     | _Object_    | _None_   | Object of key-value pairs to convert to querystring params.

# SyncRouterState

```javascript
import { SyncRouterState } from '@app-elements/router'

// If you wish to sync the router state to your own global state (redux, atom, mobx, etc.)
// {
//   route: {
//     name: "post",
//     path: "/posts/:id",
//     args: { id: 1 }
//   },
//   currentPath: "/posts/1"
// }
return (
  <SyncRouterState>
    {state => console.log("SyncRouterState", state)}
  </SyncRouterState>
)
```

# useRouter

```javascript
import { useRouter } from '@app-elements/router'

// Access some of the internal functions of the router
const {
  path,
  setPath,
  routeTo,
  route,
  setRoute
} = useRouter()
```

## useRouter props

| Prop              | Type        | Description         |
|-------------------|-------------|---------------------|
| **`path`**        | _String_    | Current path (defaults to `window.location.pathname + window.location.search`
| **`setPath`**     | _Function_  | Programmatically set the path
| **`routeTo`**     | _Function_  | Perform a "route change", calling `history.pushState` and `setPath`
| **`route`**       | _Object_    | The current matched route. [Example values](#syncrouterstate)
| **`setRoute`**    | _Function_  | Programmatically set the route. Only sets if the name does not match current `route.name`


# useScrollToTop

We're trying not to make too many assumptions, so the Router *does not* scroll to top automatically. But, there is a super simple hook to enable such behavior.

```javascript
import { useScrollToTop } from '@app-elements/router'

// ... in your top-level component
useScrollToTop()

// also returns a ref, if you would like to scroll a specific element to the
// top, rather than the whole window
const ref = useScrollToTop()

<div id="main-nav" ref={ref}>
```


