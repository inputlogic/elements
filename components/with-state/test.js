/* global test expect */

import render from 'preact-render-to-string'
import createStore from 'atom'
import withState from './index.js'

function Provider (props) { this.getChildContext = () => ({ store: props.store }) }
Provider.prototype.render = props => props.children[0]

const store = createStore([], { count: 0 })

test('withState exports', () => {
  expect(typeof withState).toBe('function')
})

test('withState should render PassedComponent', () => {
  const Stateful = withState({
    mapper: state => ({ count: state.count })
  })(({ count }) =>
    <div>
      <h1>Count: {count}</h1>
    </div>
  )
  let html = render(<Provider store={store}><Stateful /></Provider>)
  expect(html).toBe('<div><h1>Count: 0</h1></div>')
})

test('PassedComponent should update with state change', () => {
  const Stateful = withState({
    mapper: state => ({ count: state.count })
  })(({ count }) =>
    <div>
      <h1>Count: {count}</h1>
    </div>
  )
  let html = render(<Provider store={store}><Stateful /></Provider>)
  expect(html).toBe('<div><h1>Count: 0</h1></div>')
  store.setState({ count: 1 })
  html = render(<Provider store={store}><Stateful /></Provider>)
  expect(html).toBe('<div><h1>Count: 1</h1></div>')
})
