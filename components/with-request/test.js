/* global renderer afterEach jest test expect */

import createStore from 'atom'
import withRequest from './index'

jest.mock('./makeRequest')

function Provider (props) { this.getChildContext = () => ({ store: props.store }) }
Provider.prototype.render = props => props.children[0]

const store = createStore([], { requests: {} })

afterEach(() => {
  renderer.tearDown()
})

test('withRequest exports', () => {
  expect(typeof withRequest).toBe('function')
})

test('withRequest should render PassedComponent', (done) => {
  const endpoint = '/users/4'
  const Requested = withRequest({ endpoint })(({ isLoading, error, result }) =>
    <div>
      {isLoading && <p>Loading...</p>}
      {error != null && <strong>{error}</strong>}
      {result != null && <h1>User: {result.name}</h1>}
    </div>
  )

  store.subscribe(() => {
    setTimeout(() => {
      expect(renderer.html()).toBe('<div><h1>User: Mark</h1></div>')
      done()
    }, 1000)
  })

  renderer.render(<Provider store={store}><Requested /></Provider>)
  expect(renderer.html()).toBe('<div><p>Loading...</p></div>')
})
