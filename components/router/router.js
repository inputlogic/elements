import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { getRouteComponent, getAllRoutes, getHref } from './util'

const Context = createContext('Router')
let allRoutes

function useRouterState () {
  const [path, setPath] = useState(null)
  const [route, setRoute] = useState(null)

  const routeTo = newPath => {
    if (newPath !== path) {
      window.history.pushState(null, null, newPath)
      setPath(newPath)
    }
  }

  const setPathMaybe = newPath => {
    if (path == null || path !== newPath) {
      setPath(newPath)
    }
  }

  const setRouteMaybe = newRoute => {
    if (route == null || route.name !== newRoute.name) {
      setRoute(newRoute)
    }
  }

  return {
    path,
    setPath: setPathMaybe,
    routeTo,
    route,
    setRoute: setRouteMaybe
  }
}

export function useRouter () {
  const value = useContext(Context)
  if (value == null) {
    throw new Error('Component must be wrapped with <RouteProvider>')
  }
  return value
}

export function Link ({ to, args = {}, queries = {}, children, ...props }) {
  if (allRoutes == null) {
    throw new Error('<Link /> must be child of <RouteProvider />')
  }

  const rule = allRoutes[to]
  if (!rule) {
    console.error('No route found for name: ' + to)
    return
  }

  const href = getHref({ rule, args, queries })

  return (
    <Context.Consumer>
      {context => {
        const onClick = ev => {
          ev.preventDefault()
          context.routeTo(href)
        }
        return (
          <a href={href} onClick={onClick} {...props}>
            {children}
          </a>
        )
      }}
    </Context.Consumer>
  )
}

export function SyncRouterState ({ children }) {
  const routeNameRef = useRef(null)

  if (!children || typeof children !== 'function') {
    throw new Error('<SyncRouterState /> requires a function as a child.')
  }

  return (
    <Context.Consumer>
      {context => {
        if (!context || context.route == null) return
        if (
          routeNameRef.current == null ||
          routeNameRef.current !== context.route.name
        ) {
          children({ route: context.route, path: context.pat })
          routeNameRef.current = context.route.name
        }
      }}
    </Context.Consumer>
  )
}

export function RouteProvider ({ routes, initialPath, children }) {
  const value = useRouterState()

  if (allRoutes == null) {
    allRoutes = getAllRoutes(routes)
  }

  useEffect(() => {
    if (value.path == null) {
      value.setPath(initialPath || window.location.pathname + window.location.search)
    }
  }, [value.path, value.setPath])

  useEffect(() => {
    const onPop = ev => {
      const url = window.location.pathname
      if (value.path !== url) {
        window.history.replaceState(null, null, url)
        value.setPath(url)
      }
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [value.path, value.setPath])

  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function Router (props) {
  if (!props.routes) {
    throw new Error('<Router /> must be given a routes object.')
  }

  const localRoutes = props.routes
  const context = useRouter()
  if (context == null) {
    throw new Error('<Router /> must be wrapped with <RouteProvider />.')
  }

  const { path, setRoute } = context
  if (path == null) {
    return
  }

  const [Component, newRoute] = getRouteComponent(localRoutes, path)
  if (newRoute) {
    setRoute(newRoute)
  }

  return typeof Component === 'function' ? <Component /> : Component
}
