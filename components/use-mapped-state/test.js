/* global afterEach test expect */

import { render } from 'preact'
import createStore from 'atom'
import useMappedState from './index.js'

const store = createStore([], { count: 0 })

afterEach(() => {
  store.setState({ count: 0 })
  document.body.innerHTML = ''
})

test('useMappedState exports', () => {
  expect(typeof useMappedState).toBe('function')
})

test('useMappedState should render initial state', () => {
  const Stateful = (props) => {
    const { count } = useMappedState(store, state => ({ count: state.count }))
    return (
      <div>
        <p>Count: {count}</p>
      </div>
    )
  }
  render(<Stateful />, document.body)
  expect(document.body.innerHTML).toBe('<div><p>Count: 0</p></div>')
})

test('useMappedState should update when mapped state changes', (done) => {
  const Child = ({ count }) => <p>Count: {count}</p>
  const Parent = () => {
    const { count } = useMappedState(store, ({ count }) => ({ count }))
    return <div><Child count={count} /></div>
  }

  const listener = () => {
    render(<Parent />, document.body)
    setTimeout(() => {
      expect(store.getState()).toEqual({ count: 1 })
      expect(document.body.innerHTML).toBe('<div><p>Count: 1</p></div>')
      store.unsubscribe(listener)
      done()
    }, 1000)
  }

  render(<Parent />, document.body)
  expect(document.body.innerHTML).toBe('<div><p>Count: 0</p></div>')

  store.subscribe(listener)
  store.setState({ count: 1 })
})
