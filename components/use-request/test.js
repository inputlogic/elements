/* global jest test expect */

import createStore from 'atom'
import { createContext, render, Fragment } from 'preact'
import { useContext } from 'preact/hooks'
import { useRequest } from './index'

jest.mock('./request')

const store = createStore([], { count: 0 })
const Context = createContext(store)

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
  store.subscribe(() => {
    // Wait for React to re-render with updated state
    setTimeout(() => {
      render(<Context.Provider value={store}><Requested /></Context.Provider>, document.body)
      expect(document.body.innerHTML).toBe('<h1>User: Mark</h1>')
      done()
    }, 2000)
  })

  render(<Context.Provider value={store}><Requested /></Context.Provider>, document.body)
  expect(document.body.innerHTML).toBe('<p>Loading...</p>')
})
