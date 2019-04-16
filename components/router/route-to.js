import React from 'react' // Can be aliased to Preact in your project

import { getAllRoutes, getHref } from './util'

let allRoutes

export class RouteTo extends React.Component {
  render () {
    const { routes, store } = this.context
    const { name, args = {}, queries = {} } = this.props

    if (allRoutes == null) {
      allRoutes = getAllRoutes(routes)
    }

    const rule = allRoutes[name]
    if (!rule) {
      console.warn('No route found for name: ' + name)
      return
    }

    const href = getHref({ rule, args, queries })
    if (href) {
      window.history.pushState(null, null, href)
      store.setState({ currentPath: window.location.pathname })
    }

    return null
  }
}

export default RouteTo
