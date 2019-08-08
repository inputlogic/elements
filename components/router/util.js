import qs from './qs'

const hasProp = Object.prototype.hasOwnProperty

export const getAllRoutes = routes =>
  Object
    .keys(routes || {})
    .reduce((acc, r) =>
      hasProp.call(routes[r], 'routes')
        ? { ...acc, ...getAllRoutes(routes[r].routes) }
        : { ...acc, [r]: routes[r] },
    {})

export const getHref = ({ rule, args, queries }) => {
  const replaced = Object
    .keys(args)
    .reduce((acc, k) => acc.replace(`:${k}`, args[k]), rule.path)
  const hasQueries = Object.keys(queries).length > 0
  return `${replaced}${!hasQueries ? '' : '?' + qs.stringify(queries)}`
}
