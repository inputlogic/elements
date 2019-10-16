/* global afterEach test expect */

import createStore from 'atom'
import { createContext, render } from 'preact'
import { useContext } from 'preact/hooks'
import { useMappedState } from './index'

const store = createStore([], { count: 0, other: 'a' })
const Context = createContext(store)

afterEach(() => {
  store.setState({ count: 0 })
  document.body.innerHTML = ''
})

test('useMappedState exports', () => {
  expect(typeof useMappedState).toBe('function')
})

test('useMappedState should render PassedComponent', (done) => {
  const Stateful = () => {
    const store = useContext(Context)
    const { count } = useMappedState(store, ({ count }) => ({ count }))
    return (
      <p>Count: {count}</p>
    )
  }

  // Wait for store to update
  const listener = () => {
    // Wait for React to re-render with updated state
    render(<Context.Provider value={store}><Stateful /></Context.Provider>, document.body)
    setTimeout(() => {
      expect(document.body.innerHTML).toBe('<p>Count: 1</p>')
      done()
    }, 2000)
    store.unsubscribe(listener)
  }
  store.subscribe(listener)

  render(<Context.Provider value={store}><Stateful /></Context.Provider>, document.body)
  expect(document.body.innerHTML).toBe('<p>Count: 0</p>')

  store.setState({ count: 1 })
})

test('useMappedState can be used more than once per Component', (done) => {
  const Stateful = () => {
    const store = useContext(Context)
    const { count } = useMappedState(store, ({ count }) => ({ count }))
    const { other } = useMappedState(store, ({ other }) => ({ other }))
    return (
      <p>{count}/{other}</p>
    )
  }

  // Wait for store to update
  const listener = () => {
    // Wait for React to re-render with updated state
    render(<Context.Provider value={store}><Stateful /></Context.Provider>, document.body)
    setTimeout(() => {
      expect(document.body.innerHTML).toBe('<p>1/a</p>')
      done()
    }, 2000)
    store.unsubscribe(listener)
  }
  store.subscribe(listener)

  render(<Context.Provider value={store}><Stateful /></Context.Provider>, document.body)
  expect(document.body.innerHTML).toBe('<p>0/a</p>')

  store.setState({ count: 1 })
})
