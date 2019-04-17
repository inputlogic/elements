import React from 'react' // Can be aliased to Preact in your project

import { getAllRoutes, getHref } from './util'

let allRoutes

export class RouteTo extends React.Component {
  render () {
    const { routes, store } = this.context
    const { name, url, args = {}, queries = {} } = this.props
    let href

    if (url === undefined) {
      if (allRoutes == null) {
        allRoutes = getAllRoutes(routes)
      }

      const rule = allRoutes[name]
      if (!rule) {
        console.warn('No route found for name: ' + name)
        return
      }

      href = getHref({ rule, args, queries })
    } else {
      href = url
    }

    if (href) {
      window.history.pushState(null, null, href)
      store.setState({ currentPath: window.location.pathname + window.location.search })
    }

    return null
  }
}

export default RouteTo
