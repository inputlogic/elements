import W from 'wasmuth'

import connect from '@app-elements/connect'
import Pagination from '@app-elements/pagination'
import qs from '@app-elements/router/qs'
import WithRequest from '@app-elements/with-request'

// We subscribe to `currentPath` to rerender on route change
const ListResource = connect({
  name: 'ListResource',
  withState: ({ currentPath }) => ({ currentPath })
})(({
  endpoint,
  limit,
  list = true,
  pagination = false,
  render: View
}) => {
  // @TODO: Needs to access search params on SSR
  const search = typeof window !== 'undefined' ? window.location.search : ''
  const args = qs.parse(search)
  const activePage = args.page ? parseInt(args.page, 10) : 1

  const request = {
    endpoint: limit != null
      ? `${endpoint}?limit=${limit}${activePage > 1 ? `&offset=${limit * activePage}` : ''}`
      : endpoint
  }

  return (
    <WithRequest request={request}>
      {({ result, isLoading }) =>
        isLoading
          ? <p>Loading...</p>
          : <div key={request.endpoint}>
            {list
              ? W.map(
                item => <View {...item} />,
                W.pathOr(result, 'results', result)
              )
              : <View {...result} />
            }
            {pagination && limit != null
              ? <Pagination
                activePage={activePage}
                request={result}
                pageSize={limit}
              />
              : null
            }
          </div>
      }
    </WithRequest>
  )
})

export default ListResource

export const Resource = ({ endpoint, ...props }) =>
  <ListResource
    key={`resource-${endpoint}`}
    {...props}
    list={false}
    endpoint={endpoint}
  />
