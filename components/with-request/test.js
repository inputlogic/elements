/* global jest test expect */

import { render } from 'preact'
// import renderToString from 'preact-render-to-string'
import createStore from 'atom'
import withRequest from './index'

jest.mock('./makeRequest')

document.body.innerHTML = '<div id="root" />'

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
    expect(result).toBe({ name: 'Mark' })
    done()
  })

  render(<Provider store={store}><Requested /></Provider>, document.getElementById('root'))

  expect(document.body.querySelector('p').textContent).toBe('Loading...')
})

// test('PassedComponent should update with state change', () => {
//   const Requested = withRequest({
//     mapper: state => ({ count: state.count })
//   })(({ count }) =>
//     <div>
//       <h1>Count: {count}</h1>
//     </div>
//   )
//   let html = render(<Provider store={store}><Requested /></Provider>)
//   expect(html).toBe('<div><h1>Count: 0</h1></div>')
//   store.setState({ count: 1 })
//   html = render(<Provider store={store}><Requested /></Provider>)
//   expect(html).toBe('<div><h1>Count: 1</h1></div>')
// })
