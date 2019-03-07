/* global renderer afterEach getProvider jest test expect */

import createStore from 'atom'
import withRequest from './index'

jest.mock('./makeRequest')

const store = createStore([], { requests: {} })
const Provider = getProvider()

const Base = ({ isLoading, error, result }) =>
  <div>
    {isLoading && <p>Loading...</p>}
    {error != null && <strong>{error}</strong>}
    {result != null && <h1>User: {result.name}</h1>}
  </div>

afterEach(() => {
  renderer.tearDown()
})

test('withRequest exports', () => {
  expect(typeof withRequest).toBe('function')
})

test('withRequest should render PassedComponent', (done) => {
  const endpoint = '/users/4'
  const Requested = withRequest({ endpoint })(Base)

  // Wiat for store to update
  store.subscribe(() => {
    // Wait for React to re-render with updated state
    process.nextTick(() => {
      expect(renderer.html()).toBe('<div><h1>User: Mark</h1></div>')
      done()
    })
  })

  renderer.render(<Provider store={store}><Requested /></Provider>)

  expect(renderer.html()).toBe('<div><p>Loading...</p></div>')
})
