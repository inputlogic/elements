/* global getProvider renderer afterAll beforeAll afterEach test expect */

import render from 'preact-render-to-string'
import createStore from 'atom'
import useMappedState from './index.js'

const Provider = getProvider()
const store = createStore([], { count: 0 })

afterEach(() => store.setState({ count: 0 }))
beforeAll(() => renderer.setup())
afterAll(() => renderer.teardown())

test('useMappedState exports', () => {
  expect(typeof useMappedState).toBe('function')
})

test('useMappedState should render PassedComponent', () => {
  const Stateful = (props) => {
    const { count } = useMappedState(store, state => ({ count: state.count }))
    return (
      <div>
        <h1>Count: {count}</h1>
      </div>
    )
  }
  let html = render(<Provider store={store}><Stateful /></Provider>)
  expect(html).toBe('<div><h1>Count: 0</h1></div>')
})
