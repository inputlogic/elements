/* global jest test expect */

import createStore from 'atom'
import { createContext, render, Fragment } from 'preact'
import { useContext } from 'preact/hooks'
import { useRequest, requestsReducer, actions } from './index'

jest.mock('./request')

const store = createStore([requestsReducer], { count: 0 })
const Context = createContext(store)

const { appendRequest, clearRequest, clearRequests, patchListRequest } = actions

test('useRequest exports', () => {
  expect(typeof useRequest).toBe('function')
})

test('useRequest should render PassedComponent', (done) => {
  const Requested = (props) => {
    const store = useContext(Context)
    const { result } = useRequest(store, '/users/4')
    return (
      <Fragment>
        {result == null
          ? <p>Loading...</p>
          : <h1>User: {result.name}</h1>}
      </Fragment>
    )
  }

  // Wait for store to update
  const listener = () => {
    // Wait for React to re-render with updated state
    setTimeout(() => {
      render(<Context.Provider value={store}><Requested /></Context.Provider>, document.body)
      expect(document.body.innerHTML).toBe('<h1>User: Mark</h1>')
      done()
    }, 2000)
    store.unsubscribe(listener)
  }
  store.subscribe(listener)

  render(<Context.Provider value={store}><Requested /></Context.Provider>, document.body)
  expect(document.body.innerHTML).toBe('<p>Loading...</p>')
})

test('useRequest can be used more than once per Component', (done) => {
  const Requested = (props) => {
    const store = useContext(Context)
    const { result: user1 } = useRequest(store, '/users/4')
    const { result: user2 } = useRequest(store, '/users/5')
    return (
      <Fragment>
        {user1 == null || user2 == null
          ? <p>Loading...</p>
          : <h1>{user1.name}/{user2.name}</h1>}
      </Fragment>
    )
  }

  // Wait for store to update
  const listener = () => {
    // Wait for React to re-render with updated state
    setTimeout(() => {
      render(<Context.Provider value={store}><Requested /></Context.Provider>, document.body)
      expect(document.body.innerHTML).toBe('<h1>Mark/Paul</h1>')
      done()
    }, 2000)
    store.unsubscribe(listener)
  }
  store.subscribe(listener)

  render(<Context.Provider value={store}><Requested /></Context.Provider>, document.body)
  expect(document.body.innerHTML).toBe('<p>Loading...</p>')
})

test('useRequest will cache by uid if provided', (done) => {
  const Requested = (props) => {
    const store = useContext(Context)
    const { result: user1 } = useRequest(store, '/users/4')
    const { result: user2 } = useRequest(store, '/users/4', { uid: '/users/4?hjagsdjk' })
    return (
      <Fragment>
        {user1 == null || user2 == null
          ? <p>Loading...</p>
          : <h1>{user1.name}/{user2.name}</h1>}
      </Fragment>
    )
  }

  // Wait for store to update
  const listener = () => {
    // Wait for React to re-render with updated state
    setTimeout(() => {
      render(<Context.Provider value={store}><Requested /></Context.Provider>, document.body)
      expect(document.body.innerHTML).toBe('<h1>Mark/Mark</h1>')
      expect(store.getState().requests).toHaveProperty('/users/4')
      expect(store.getState().requests).toHaveProperty('/users/4?hjagsdjk')
      done()
    }, 2000)
    store.unsubscribe(listener)
  }
  store.subscribe(listener)

  render(<Context.Provider value={store}><Requested /></Context.Provider>, document.body)
  expect(document.body.innerHTML).toBe('<p>Loading...</p>')
})

test('appendRequest should append an item to a request result', () => {
  const endpoint = '/users'
  const result = [{ id: 4, name: 'Mark' }, { id: 5, name: 'Paul' }]
  // fake existing/cached request
  const store = createStore([requestsReducer], { requests: { [endpoint]: { result } } })
  expect(store.getState().requests[endpoint].result[0].name).toBe('Mark')

  store.dispatch(appendRequest({
    endpointOrUid: endpoint,
    path: '',
    item: { id: 6, name: 'Margo' }
  }))

  const results = store.getState().requests[endpoint].result
  const len = results.length
  const last = results[len - 1]

  expect(len).toBe(3)
  expect(last.name).toBe('Margo')
})

test('patchListRequest should patch a nested item in a request result', () => {
  const endpoint = '/users'
  const result = [{ id: 4, name: 'Mark' }, { id: 5, name: 'Paul' }]
  // fake existing/cached request
  const store = createStore([requestsReducer], { requests: { [endpoint]: { result } } })
  expect(store.getState().requests[endpoint].result[0].name).toBe('Mark')

  store.dispatch(patchListRequest({
    endpointOrUid: endpoint,
    path: '',
    dataToMerge: { id: 4, name: 'Patched' }
  }))

  expect(store.getState().requests[endpoint].result[0].name).toBe('Patched')
})

test('patchListRequest should support string delim path value', () => {
  const endpoint = 'https://coolapi.com/users'
  const data = [{ id: 4, name: 'Mark' }, { id: 5, name: 'Paul' }]
  // fake existing/cached request
  const store = createStore([requestsReducer], { requests: { [endpoint]: { result: { results: { data } } } } })
  expect(store.getState().requests[endpoint].result.results.data[0].name).toBe('Mark')

  store.dispatch(patchListRequest({
    endpointOrUid: endpoint,
    path: 'results.data',
    dataToMerge: { id: 4, name: 'Patched' }
  }))

  expect(store.getState().requests[endpoint].result.results.data[0].name).toBe('Patched')
})

test('patchListRequest should support array path value', () => {
  const endpoint = 'https://coolapi.com/users'
  const data = [{ id: 4, name: 'Mark' }, { id: 5, name: 'Paul' }]
  // fake existing/cached request
  const store = createStore([requestsReducer], { requests: { [endpoint]: { result: { results: { data } } } } })
  expect(store.getState().requests[endpoint].result.results.data[0].name).toBe('Mark')

  store.dispatch(patchListRequest({
    endpointOrUid: endpoint,
    path: ['results', 'data'],
    dataToMerge: { id: 4, name: 'Patched' }
  }))

  expect(store.getState().requests[endpoint].result.results.data[0].name).toBe('Patched')
})

test('clearRequest action will clear cached request', (done) => {
  expect(Object.keys(store.getState().requests).length).toBe(3)

  const listener = () => {
    expect(Object.keys(store.getState().requests).length).toBe(2)
    store.unsubscribe(listener)
    done()
  }
  store.subscribe(listener)
  store.dispatch(clearRequest('/users/4'))
})

test('clearRequests action will clear multiple requests', (done) => {
  expect(Object.keys(store.getState().requests).length).toBe(2)

  const listener = () => {
    expect(Object.keys(store.getState().requests).length).toBe(0)
    store.unsubscribe(listener)
    done()
  }
  store.subscribe(listener)
  store.dispatch(clearRequests(uid => uid.indexOf('users') > -1))
})
