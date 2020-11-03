import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { getRouteComponent, getAllRoutes, getHref } from './util'

const Context = createContext('Router')
let allRoutes
let skipScroll

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

export function useScrollToTop () {
  const backRef = useRef(false)
  const nodeRef = useRef()
  const pathRef = useRef()
  const { path } = useRouter()

  useEffect(() => {
    const onPop = () => (backRef.current = true)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const isBack = backRef && backRef.current

  if (!isBack && path !== pathRef.current) {
    if (path !== skipScroll) {
      if (nodeRef && nodeRef.current) {
        nodeRef.current.scrollIntoView()
      } else {
        window.scrollTo(0, 0)
      }
    } else {
      skipScroll = null
    }

    pathRef.current = path
  } else if (isBack) {
    backRef.current = false
  }

  return nodeRef
}

export function Link ({
  to,
  name,
  className,
  activeClass,
  args = {},
  queries = {},
  hash,
  noScroll,
  children,
  ...props
}) {
  if (allRoutes == null) {
    throw new Error('<Link /> must be child of <RouteProvider />')
  }

  to = to || name

  const rule = allRoutes[to]
  if (!rule) {
    console.error('No route found for name: ' + to)
    return null
  }

  const href = getHref({ rule, args, queries, hash })

  return (
    <Context.Consumer>
      {({ path, routeTo }) => {
        const isActive = path === href
        const onClick = ev => {
          ev.preventDefault()
          if (noScroll) {
            skipScroll = href
          }
          routeTo(href)
        }
        return (
          <a
            href={href}
            onClick={onClick}
            className={(`${className || ''} ${isActive ? activeClass : ''}`).trim()}
            {...props}
          >
            {children}
          </a>
        )
      }}
    </Context.Consumer>
  )
}

export function RouteTo ({ to, name, url, args = {}, queries = {}, hash }) {
  let href

  to = to || name

  if (url != null) {
    href = url
  } else {
    if (allRoutes == null) {
      throw new Error('<RouteTo /> must be child of <RouteProvider />')
    }

    const rule = allRoutes[to]
    if (!rule) {
      throw new Error('No route found for name: ' + to)
    }

    href = getHref({ rule, args, queries, hash })
  }

  return (
    <Context.Consumer>
      {context => {
        if (href) {
          context.routeTo(href)
        }
        return null
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
        if (!context || context.route == null) return null
        if (
          routeNameRef.current == null ||
          routeNameRef.current !== context.route.name
        ) {
          children({ route: context.route, path: context.path })
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
    return null
  }

  const pair = getRouteComponent(localRoutes, path)

  if (pair == null) {
    setRoute({ name: 'Not Found', args: {}, notFound: true, path })
    return null
  }

  const [Component, newRoute] = pair

  if (newRoute) {
    setRoute(newRoute)
  }

  const childProps = newRoute != null ? newRoute.args : {}

  return typeof Component === 'function'
    ? <Component {...childProps} />
    : Component
}

export function StackRouter ({ routes: localRoutes, limit = 2, children }) {
  const stackRef = useRef([])

  if (!localRoutes) {
    throw new Error('<StackRouter /> must be given a routes object.')
  }

  const context = useRouter()

  if (context == null) {
    throw new Error('<StackRouter /> must be wrapped with <RouteProvider />.')
  }

  useEffect(() => {
    const onPop = () => {
      stackRef.current = stackRef.current.slice(0, -1)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [stackRef])

  const { path, setRoute } = context

  if (path == null) {
    return null
  }

  const pair = getRouteComponent(localRoutes, path)

  if (pair == null) {
    setRoute({ name: 'Not Found', args: {}, notFound: true, path })
    return null
  }

  const [Component, newRoute] = pair

  if (newRoute) {
    setRoute(newRoute)
    const last = stackRef.current[stackRef.current.length - 1]
    if (last == null || last.path !== path) {
      if (last != null) {
        stackRef.current[stackRef.current.length - 1].isBack = true
      }
      stackRef.current = [].concat(
        stackRef.current,
        Object.assign({}, newRoute, { Component, path })
      )
    }
  }

  const stack = stackRef.current.length > limit
    ? stackRef.current.slice(-limit)
    : [].concat(stackRef.current)

  return children({ stack })
}
