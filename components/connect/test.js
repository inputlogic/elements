/* global getProvider afterEach jest test expect */

import { render } from 'preact'
import createStore from 'atom'
import connect from './index'

jest.mock('@app-elements/with-request/makeRequest')

const Provider = getProvider()
const store = createStore([], { count: 0 })

afterEach(() => {
  store.setState({ count: 0 })
  document.body.innerHTML = ''
})

test('connect exports', () => {
  expect(typeof connect).toBe('function')
})

test('connect should render PassedComponent with state', (done) => {
  const Connected = connect({
    withState: ({ count }) => ({ count })
  })(({ count }) =>
    <div>
      <p>Count: {count}</p>
    </div>
  )

  // Wait for store to update
  const listener = () => {
    // Wait for React to re-render with updated state
    setTimeout(() => {
      expect(document.body.innerHTML).toBe('<div><p>Count: 1</p></div>')
      store.unsubscribe(listener)
      done()
    }, 1000)
  }
  store.subscribe(listener)

  // Do initial render
  render(<Provider store={store}><Connected /></Provider>, document.body)
  expect(document.body.innerHTML).toBe('<div><p>Count: 0</p></div>')

  // Update state so listener is called
  store.setState({ count: 1 })
})

test('connect should render PassedComponent with request', (done) => {
  const endpoint = '/users/4'
  const Requested = connect({
    withRequest: { endpoint }
  })(({ result }) =>
    <div>
      {result != null
        ? <h1>User: {result.name}</h1>
        : <p>Loading...</p>}
    </div>
  )

  // Wait for store to update
  const listener = () => {
    // Wait for React to re-render with updated state
    setTimeout(() => {
      expect(document.body.innerHTML).toBe('<div><h1>User: Mark</h1></div>')
      done()
    }, 1000)
    store.unsubscribe(listener)
  }
  store.subscribe(listener)

  // Do initial render
  render(<Provider store={store}><Requested /></Provider>, document.body)
  expect(document.body.innerHTML).toBe('<div><p>Loading...</p></div>')
})
