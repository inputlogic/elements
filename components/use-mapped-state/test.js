/* global getProvider renderer beforeAll afterAll test expect */

import { act } from 'preact/test-utils'
import createStore from 'atom'
import useMappedState from './index.js'

const Provider = getProvider()
const store = createStore([], { count: 0 })

// afterEach(() => store.setState({ count: 0 }))
beforeAll(() => renderer.setup())
afterAll(() => renderer.teardown())

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
  renderer.render(<Provider store={store}><Stateful /></Provider>)
  expect(renderer.html()).toBe('<div><p>Count: 0</p></div>')
})

test('useMappedState should update when mapped state changes', (done) => {
  const Child = ({ count }) => <p>Count: {count}</p>
  const Parent = () => {
    const { count } = useMappedState(store, ({ count }) => ({ count }))
    return <div><Child count={count} /></div>
  }

  const listener = () => {
    act(() => {
      renderer.render(<Provider store={store}><Parent /></Provider>)
    })
    expect(store.getState()).toEqual({ count: 1 })
    expect(renderer.html()).toBe('<div><p>Count: 1</p></div>')
    store.unsubscribe(listener)
    done()
  }

  store.subscribe(listener)
  store.setState({ count: 1 })
})
