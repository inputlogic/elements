import W from 'wasmuth'
import {connect} from 'unistore/react' // Can alias to `unistore/preact` in host project

import Pagination from '@app-elements/pagination'
import qs from '@app-elements/router/qs'
import WithRequest from '@app-elements/with-request'

const OK_TYPES = ['function', 'object']

// We subscribe to `currentPath` to rerender on route change
const ListResource = connect('currentPath', {})(({
  endpoint,
  limit,
  list = true,
  pagination = false,
  children
}) => {
  const Child = children[0]
  const type = typeof Child
  if (!Child || !OK_TYPES.includes(type)) {
    throw new Error('ListResource requires a function or Component as its only child')
  }
  const func = type === 'function' ? Child : props => <Child {...props} />

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
      {({result, isLoading}) =>
        isLoading
          ? <p>Loading...</p>
          : <div key={request.endpoint}>
            {list ? W.map(func, W.pathOr(result, 'results', result)) : func({...result})}
            {pagination && limit != null
              ? <Pagination activePage={activePage} request={result} pageSize={limit} />
              : null
            }
          </div>
      }
    </WithRequest>
  )
})

export default ListResource

export const Resource = ({endpoint, ...props}) =>
  <ListResource key={`resource-${endpoint}`} list={false} endpoint={endpoint} {...props} />
