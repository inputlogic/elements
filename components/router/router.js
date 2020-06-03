import React, { useEffect, useRef } from 'react'
import { getRouteComponent, getAllRoutes, getHref } from './util'
import { createState, useGlobalState } from './create-state'

const EMPTY = Symbol('Empty')
const state = createState({ path: EMPTY, route: EMPTY })
let allRoutes = EMPTY

const routeTo = path => {
  if (path !== state.get().path) {
    window.history.pushState(null, null, path)
    state.set({ path })
  }
}

const setPath = path => {
  if (state.get().path === EMPTY || state.get().path !== path) {
    state.set({ path })
  }
}

const setRoute = route => {
  if (state.get().route === EMPTY || state.get().route.name !== route.name) {
    state.set({ route })
  }
}

export function Link ({ to, args = {}, queries = {}, children, ...props }) {
  if (allRoutes === EMPTY) {
    throw new Error('<Link /> must be child of <RouteProvider />')
  }

  const rule = allRoutes[to]
  if (!rule) {
    console.log({ allRoutes, to })
    throw new Error('No route found for name: ' + to)
  }

  const href = getHref({ rule, args, queries })

  const onClick = ev => {
    ev.preventDefault()
    routeTo(href)
  }

  return (
    <a href={href} onClick={onClick} {...props}>
      {children}
    </a>
  )
}

export function SyncRouterState ({ children }) {
  const routeNameRef = useRef(EMPTY)
  const value = useGlobalState(state)
  if (typeof children !== 'function') {
    throw new Error('SyncRouterState expects a function as a child.')
  }
  if (
    routeNameRef.current === EMPTY ||
    routeNameRef.current !== value.route.name
  ) {
    routeNameRef.current = value.route.name
    children(value)
  }
}

export function RouteProvider ({ routes, initialPath, children }) {
  const value = useGlobalState(state)

  if (allRoutes === EMPTY) {
    allRoutes = getAllRoutes(routes)
  }

  useEffect(() => {
    if (value.path === EMPTY) {
      setPath(initialPath || window.location.pathname + window.location.search)
    }
  }, [value.path])

  useEffect(() => {
    const onPop = ev => {
      const url = window.location.pathname
      if (value.path !== url) {
        window.history.replaceState(null, null, url)
        setPath(url)
      }
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [value.path])

  return children
}

export function Router (props) {
  if (!props.routes) {
    throw new Error('<Router /> must be given a routes object.')
  }

  const localRoutes = props.routes
  const currentState = useGlobalState(state)

  if (currentState === EMPTY) {
    throw new Error('<Router /> must be wrapped with <RouteProvider>')
  }

  const { path } = currentState
  if (path === EMPTY) {
    return
  }

  const [Component, newRoute] = getRouteComponent(localRoutes, path)
  if (newRoute) {
    setRoute(newRoute)
  }

  return typeof Component === 'function' ? (
    <Component routeTo={routeTo} />
  ) : (
    Component
  )
}
