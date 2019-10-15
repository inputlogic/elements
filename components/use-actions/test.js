/* global afterEach test expect */

import { render } from 'preact'
import createStore from 'atom'
import { useActions } from './index.js'

const store = createStore([], { count: 0 })

export const actions = {
  multiply: (state, amount) => ({ count: state.count * amount }),
  add: (state, amount) => ({ count: state.count + amount })
}

afterEach(() => {
  store.setState({ count: 0 })
  document.body.innerHTML = ''
})

test('useActions exports', () => {
  expect(typeof useActions).toBe('function')
})

test('useActions should provide actions', (done) => {
  const Stateful = (props) => {
    const { multiply, add } = useActions(store, actions)
    expect(store.getState()).toEqual({ count: 0 })
    add(2)
    expect(store.getState()).toEqual({ count: 2 })
    multiply(2)
    expect(store.getState()).toEqual({ count: 4 })
    done()
    return null
  }
  render(<Stateful />, document.body)
})
