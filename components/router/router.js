import React from 'react' // Can be aliased to `preact` in host project

import withState from '@app-elements/with-state'
import equal from '@app-elements/equal'

import qs from './qs'

let storeRef

const segmentize = (url) => {
  return url.replace(/(^\/+|\/+$)/g, '').split('/')
}

export function updateQuery (queries) {
  const existingParams = qs.parse(window.location.search)
  return window.location.pathname + `?${qs.stringify({ ...existingParams, ...queries })}`
}

export function routeTo (to, replaceState) {
  const method = replaceState != null ? 'replaceState' : 'pushState'
  window.history[method](null, null, to)
  storeRef && storeRef.setState({ currentPath: window.location.pathname })
}

// route matching logic, taken from preact-router
export const exec = (url, route) => {
  let reg = /(?:\?([^#]*))?(#.*)?$/
  let c = url.match(reg)
  let matches = {}
  let ret
  if (c && c[1]) {
    let p = c[1].split('&')
    for (let i = 0; i < p.length; i++) {
      let r = p[i].split('=')
      matches[decodeURIComponent(r[0])] = decodeURIComponent(r.slice(1).join('='))
    }
  }
  url = segmentize(url.replace(reg, ''))
  route = segmentize(route || '')
  let max = Math.max(url.length, route.length)
  for (let i = 0; i < max; i++) {
    if (route[i] && route[i].charAt(0) === ':') {
      let param = route[i].replace(/(^:|[+*?]+$)/g, '')
      let flags = (route[i].match(/[+*?]+$/) || {})[0] || ''
      let plus = ~flags.indexOf('+')
      let star = ~flags.indexOf('*')
      let val = url[i] || ''
      if (!val && !star && (flags.indexOf('?') < 0 || plus)) {
        ret = false
        break
      }
      matches[param] = decodeURIComponent(val)
      if (plus || star) {
        matches[param] = url.slice(i).map(decodeURIComponent).join('/')
        break
      }
    } else if (route[i] !== url[i]) {
      ret = false
      break
    }
  }
  if (ret === false) return false
  return matches
}

class RouterBase extends React.Component {
  constructor (props, { store }) {
    super(props)
    storeRef = store
  }

  render () {
    const { routes, currentPath } = this.props

    for (let route in routes) {
      if (routes[route].hasOwnProperty('routes')) {
        const shouldRender = Object
          .values(routes[route].routes)
          .some(({ path }) => path && exec(currentPath, path))
        if (shouldRender) {
          const App = routes[route].component
          return <App />
        }
      } else {
        const routeArgs = exec(currentPath, routes[route].path)
        if (routeArgs) {
          const newRoute = {
            name: route,
            path: routes[route].path,
            args: routeArgs
          }
          if (!equal(newRoute, storeRef.getState().currentRoute)) {
            storeRef.setState({ currentRoute: newRoute })
          }
          const Component = routes[route].component
          return <Component {...routeArgs} />
        }
      }
    }
  }
}

export const Router = withState({
  name: 'Router',
  mapper: ({ currentPath }) => ({ currentPath })
})(RouterBase)

export default Router

if (typeof window !== 'undefined') {
  window.addEventListener('popstate', function () {
    const url = window.location.pathname
    const currentPath = storeRef.getState().currentPath
    if (currentPath !== url) {
      window.history['pushState'](null, null, url)
      storeRef.setState({ currentPath: url })
    }
  })

  document.addEventListener('click', ev => {
    let anchor = ev.target
    while (anchor.parentNode) {
      if (anchor.nodeName === 'A') break
      anchor = anchor.parentNode
    }
    if (anchor.nodeName === 'A' && storeRef) {
      const url = anchor.getAttribute('href')
      if (ev.metaKey) return
      if (url.indexOf('mailto:') === 0) return
      if (anchor.hasAttribute('data-external-link')) return
      ev.preventDefault()
      ev.stopImmediatePropagation()
      window.scrollTo(0, 0)
      const currentPath = storeRef.getState().currentPath
      if (currentPath !== url) {
        window.history['pushState'](null, null, url)
        storeRef.setState({ currentPath: url })
      }
    }
  })
}
