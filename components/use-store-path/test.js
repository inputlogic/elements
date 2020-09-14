/* global afterEach test expect */

import createStore from 'atom'
import { createContext, render } from 'preact'
import { useContext } from 'preact/hooks'
import { useStorePath } from './use-store-path'

const store = createStore([], {
  count: 0,
  nested: { items: { value: 'a', untouched: 'b' } }
})
const Context = createContext(store)

afterEach(() => {
  store.setState({ count: 0 })
  document.body.innerHTML = ''
})

test('useStorePath exports', () => {
  expect(typeof useStorePath).toBe('function')
})

test('useStorePath should return value, set value, and update', (done) => {
  let setter
  const Stateful = () => {
    const store = useContext(Context)
    const [count, setCount] = useStorePath(store, 'count')
    setter = () => setCount(count + 1)
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

  setter()
})

test('useStorePath can be used more than once per Component', (done) => {
  let setter
  const Stateful = () => {
    const store = useContext(Context)
    const [count] = useStorePath(store, 'count')
    const [value, setValue] = useStorePath(store, 'nested.items.value')
    setter = () => setValue('changed')
    return (
      <p>{count}/{value}</p>
    )
  }

  // Wait for store to update
  const listener = () => {
    // Wait for React to re-render with updated state
    render(<Context.Provider value={store}><Stateful /></Context.Provider>, document.body)
    setTimeout(() => {
      expect(document.body.innerHTML).toBe('<p>1/changed</p>')
      expect(store.getState().nested.items.untouched).toBe('b')
      expect(store.getState().nested.items.value).toBe('changed')
      expect(store.getState().count).toBe(1)
      done()
    }, 2000)
    store.unsubscribe(listener)
  }
  store.subscribe(listener)

  render(<Context.Provider value={store}><Stateful /></Context.Provider>, document.body)
  expect(document.body.innerHTML).toBe('<p>0/a</p>')

  store.setState({ count: 1 })
  setter()
})
