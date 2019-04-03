/* global getProvider afterEach test expect */

import { render } from 'preact'
import createStore from 'atom'
import withState from './index.js'

const Provider = getProvider()
const store = createStore([], { count: 0 })

afterEach(() => {
  store.setState({ count: 0 })
  document.body.innerHTML = ''
})

test('withState exports', () => {
  expect(typeof withState).toBe('function')
})

test('withState should render PassedComponent', () => {
  const Stateful = withState({
    mapper: state => ({ count: state.count })
  })(({ count }) =>
    <div>
      <p>Count: {count}</p>
    </div>
  )
  render(<Provider store={store}><Stateful /></Provider>, document.body)
  expect(document.body.innerHTML).toBe('<div><p>Count: 0</p></div>')
})

test('withState should accept mapper function as only argument', () => {
  const Stateful = withState(state => ({ count: state.count }))(({ count }) =>
    <div>
      <p>Count: {count}</p>
    </div>
  )
  render(<Provider store={store}><Stateful /></Provider>, document.body)
  expect(document.body.innerHTML).toBe('<div><p>Count: 0</p></div>')
})

test('PassedComponent should update with props change', (done) => {
  const Child = withState(({ x }) => ({ x }))(({ count }) =>
    <p>Count: {count}</p>
  )

  const Parent = withState(({ count }) => ({ count }))(({ count }) =>
    <div>
      <Child count={count} />
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
  render(<Provider store={store}><Parent /></Provider>, document.body)
  expect(document.body.innerHTML).toBe('<div><p>Count: 0</p></div>')

  // Update state so listener is called
  store.setState({ count: 1 })
})
