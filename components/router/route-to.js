import React from 'react' // Can be aliased to Preact in your project

import { getAllRoutes, getHref } from './util'
import { routeTo } from './router'

let allRoutes

export class RouteTo extends React.Component {
  render () {
    const { routes } = this.context
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

    href && routeTo(href)

    return null
  }
}

export default RouteTo
