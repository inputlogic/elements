/* global jest test expect */

import { render } from 'preact'
// import renderToString from 'preact-render-to-string'
import createStore from 'atom'
import withRequest from './index'

jest.mock('./makeRequest')

function Provider (props) { this.getChildContext = () => ({ store: props.store }) }
Provider.prototype.render = props => props.children[0]

const store = createStore([], { requests: {} })

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
    const result = store.getState().requests[endpoint]
    console.log('KJASHDLKJASGHDLJKASGDL', result.result)
    done()
  })

  render(
    <Provider store={store}><Requested /></Provider>,
    document.body
  )

  expect(document.body.querySelector('p').textContent).toBe('Loading...')
})
