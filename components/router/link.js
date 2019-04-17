import React from 'react' // Can be aliased to Preact in your project
import withState from '@app-elements/with-state'

import { getAllRoutes, getHref } from './util'

let allRoutes

const ActiveStateLink = withState({
  name: 'ActiveStateLink',
  mapper: ({ currentPath }, { href }) => ({
    isActive: currentPath === href
  })
})(({ isActive, activeClass, href, className, children }) =>
  <a
    href={href}
    className={(`${className || ''} ${isActive ? activeClass : ''}`).trim()}
  >
    {children}
  </a>
)

export class Link extends React.Component {
  render () {
    const { routes } = this.context
    const { name, args = {}, queries = {}, activeClass, children, ...props } = this.props

    if (allRoutes == null) {
      allRoutes = getAllRoutes(routes)
    }

    const rule = allRoutes[name]
    if (!rule) {
      console.warn('No route found for name: ' + name)
      return
    }

    const href = getHref({ rule, args, queries })

    return activeClass != null
      ? <ActiveStateLink activeClass={activeClass} href={href}>{children}</ActiveStateLink>
      : <a href={href} {...props}>{children}</a>
  }
}

export default Link
