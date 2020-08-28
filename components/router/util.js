import { parse, stringify } from './qs'

const hasProp = Object.prototype.hasOwnProperty

const segmentize = url => {
  return url.replace(/(^\/+|\/+$)/g, '').split('/')
}

export function updateQuery (queries) {
  const existingParams = parse(window.location.search)
  return window.location.pathname + `?${stringify({ ...existingParams, ...queries })}`
}

// route matching logic, taken from preact-router
export const exec = (url, route) => {
  const reg = /(?:\?([^#]*))?(#.*)?$/
  const c = url.match(reg)
  const matches = {}
  let ret
  if (c && c[1]) {
    const p = c[1].split('&')
    for (let i = 0; i < p.length; i++) {
      const r = p[i].split('=')
      matches[decodeURIComponent(r[0])] = decodeURIComponent(
        r.slice(1).join('=')
      )
    }
  }
  url = segmentize(url.replace(reg, ''))
  route = segmentize(route || '')
  const max = Math.max(url.length, route.length)
  for (let i = 0; i < max; i++) {
    if (route[i] && route[i].charAt(0) === ':') {
      const param = route[i].replace(/(^:|[+*?]+$)/g, '')
      const flags = (route[i].match(/[+*?]+$/) || {})[0] || ''
      const plus = ~flags.indexOf('+')
      const star = ~flags.indexOf('*')
      const val = url[i] || ''
      if (!val && !star && (flags.indexOf('?') < 0 || plus)) {
        ret = false
        break
      }
      matches[param] = decodeURIComponent(val)
      if (plus || star) {
        matches[param] = url
          .slice(i)
          .map(decodeURIComponent)
          .join('/')
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

export function getRouteComponent (routes, currentPath) {
  for (const route in routes) {
    if (hasProp.call(routes[route], 'routes')) {
      const shouldRender = Object.values(routes[route].routes).some(
        ({ path }) => path && exec(currentPath, path)
      )
      if (shouldRender) {
        const App = routes[route].component
        return [App, null]
      }
    } else {
      const routeArgs = exec(currentPath, routes[route].path)
      if (routeArgs) {
        const newRoute = {
          name: route,
          path: routes[route].path,
          args: {
            ...(routes[route].args || {}),
            ...routeArgs
          }
        }
        const Component = routes[route].component
        return [Component, newRoute]
      }
    }
  }
}

export const getAllRoutes = routes =>
  Object.keys(routes || {}).reduce(
    (acc, r) =>
      hasProp.call(routes[r], 'routes')
        ? { ...acc, ...getAllRoutes(routes[r].routes) }
        : { ...acc, [r]: routes[r] },
    {}
  )

export const getHref = ({ rule, args, queries, hash }) => {
  const replaced = Object.keys(args).reduce(
    (acc, k) => acc.replace(`:${k}`, args[k]),
    rule.path
  )
  const hasQueries = Object.keys(queries).length > 0
  const hashStr = hash != null ? `#${hash}` : ''
  return `${replaced}${!hasQueries ? '' : '?' + stringify(queries)}${hashStr}`
}
