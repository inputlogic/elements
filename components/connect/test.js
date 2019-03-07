/* global renderer afterAll beforeAll getProvider jest test expect */

import createStore from 'atom'
import connect from './index'

jest.mock('@app-elements/with-request/makeRequest')

const store = createStore([], { requests: {}, count: 0 })
const Provider = getProvider()

beforeAll(() => renderer.setup())

afterAll(() => renderer.teardown())

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
    process.nextTick(() => {
      expect(renderer.html()).toBe('<div><p>Count: 1</p></div>')
      store.unsubscribe(listener)
      done()
    })
  }
  store.subscribe(listener)

  // Do initial render
  renderer.render(<Provider store={store}><Connected /></Provider>)
  expect(renderer.html()).toBe('<div><p>Count: 0</p></div>')

  // Update state so listener is called
  store.setState({ count: 1 })
})

test('connect should render PassedComponent with request', (done) => {
  const endpoint = '/users/4'
  const Requested = connect({
    withRequest: { endpoint }
  })(({ isLoading, error, result }) =>
    <div>
      {isLoading && <p>Loading...</p>}
      {error != null && <strong>{error}</strong>}
      {result != null && <h1>User: {result.name}</h1>}
    </div>
  )

  // Wait for store to update
  const listener = () => {
    // Wait for React to re-render with updated state
    process.nextTick(() => {
      expect(renderer.html()).toBe('<div><h1>User: Mark</h1></div>')
      done()
    })
    store.unsubscribe(listener)
  }
  store.subscribe(listener)

  // Do initial render
  renderer.render(<Provider store={store}><Requested /></Provider>)
  expect(renderer.html()).toBe('<div><p>Loading...</p></div>')
})
