import React from 'react' // Can be aliased to Preact in your project

import { getAllRoutes, getHref } from './util'

let allRoutes

export class Link extends React.Component {
  render () {
    const { routes } = this.context
    const { name, args = {}, queries = {}, children, ...props } = this.props

    if (allRoutes == null) {
      allRoutes = getAllRoutes(routes)
    }

    const rule = allRoutes[name]
    if (!rule) {
      console.warn('No route found for name: ' + name)
      return
    }

    const href = getHref({ rule, args, queries })

    return (
      <a href={href} {...props}>{children}</a>
    )
  }
}

export default Link
