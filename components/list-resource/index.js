import React from 'react'
import map from '@wasmuth/map'
import pathOr from '@wasmuth/path-or'
import connect from '@app-elements/connect'
import Pagination from '@app-elements/pagination'
import qs from '@app-elements/router/qs'

const getActivePage = () => {
  const search = typeof window !== 'undefined' ? window.location.search : ''
  const args = qs.parse(search)
  return args.page ? parseInt(args.page, 10) : 1
}

// We subscribe to `currentPath` to rerender on route change
const ListResource = connect({
  name: 'ListResource',
  withState: ({ currentPath }) => ({ currentPath }),
  withRequest: {
    endpoint: ({ limit, endpoint }) => {
      const activePage = getActivePage()
      return limit != null
        ? `${endpoint}?limit=${limit}${activePage > 1 ? `&offset=${limit * activePage}` : ''}`
        : endpoint
    }
  }
})(({
  endpoint,
  limit,
  list = true,
  pagination = false,
  result,
  isLoading,
  render: View
}) =>
  isLoading
    ? <p>Loading...</p>
    : (
      <div key={endpoint}>
        {list
          ? map(
            (item, idx) => <View key={item.id || idx} {...item} />,
            pathOr(result, 'results', result)
          )
          : <View {...result} />}
        {pagination && limit != null
          ? (
            <Pagination
              activePage={getActivePage()}
              request={result}
              pageSize={limit}
            />
          )
          : null}
      </div>
    )
)

export default ListResource

export const Resource = ({ endpoint, ...props }) =>
  <ListResource
    key={`resource-${endpoint}`}
    {...props}
    list={false}
    endpoint={endpoint}
  />
