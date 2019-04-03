/* global afterEach getProvider jest test expect */

import { render, Fragment } from 'preact'
import { setupRerender } from 'preact/test-utils'
import createStore from 'atom'
import withRequest from './index'

jest.mock('./makeRequest')

const Provider = getProvider()
const store = createStore([], { count: 0 })

afterEach(() => {
  store.setState({ count: 0 })
  document.body.innerHTML = ''
})

const Base = ({ result }) =>
  <Fragment>
    {result == null
      ? <p>Loading...</p>
      : <h1>User: {result.name}</h1>}
  </Fragment>

test('withRequest exports', () => {
  expect(typeof withRequest).toBe('function')
})

test('withRequest should render PassedComponent', (done) => {
  const endpoint = '/users/4'
  const Requested = withRequest({ endpoint })(Base)
  const rerender = setupRerender()

  // Wait for store to update
  store.subscribe(() => {
    // Wait for React to re-render with updated state
    setTimeout(() => {
      rerender()
      expect(document.body.innerHTML).toBe('<h1>User: Mark</h1>')
      done()
    }, 1000)
  })

  render(<Provider store={store}><Requested /></Provider>, document.body)
  expect(document.body.innerHTML).toBe('<p>Loading...</p>')
})
