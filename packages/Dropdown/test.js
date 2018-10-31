/* global test expect */

import render from 'preact-render-to-string'
import createStore from 'unistore'

import Dropdown from './index.js'

let store = createStore({})

test('Dropdown exports', () => {
  expect(typeof Dropdown).toBe('function')
})

test('Dropdown should render default trigger button', (t) => {
  const output = render(
    <Dropdown uid='1'>
      <p>1</p>
      <p>2</p>
      <p>3</p>
    </Dropdown>
  , {store})
  console.log(output)
  expect(output).toBe('<div>Hello world</div>')
})
