/* global test expect */

import {render} from 'preact'

import createStore from 'unistore'
import {Provider} from 'unistore/preact'

import Dropdown from './index.js'

let store = createStore({dropdown: null})

test('Dropdown exports', () => {
  expect(typeof Dropdown).toBe('function')
})

test('Dropdown should render default trigger button', () => {
  render(
    <Provider store={store}>
      <Dropdown uid='1'>
        <p>Child</p>
      </Dropdown>
    </Provider>,
    document.body
  )
  expect(document.body.querySelector('button').textContent).toBe('Select')
})

test('Dropdown should be closed', () => {
  render(
    <Provider store={store}>
      <Dropdown uid='1'>
        <p>Child</p>
      </Dropdown>
    </Provider>,
    document.body
  )
  expect(document.body.querySelector('.dropdown-menu.open')).toBeNull()
  expect(document.body.querySelector('.dropdown-menu.close')).toBeDefined()
})

test('Dropdown should not render children', () => {
  render(
    <Provider store={store}>
      <Dropdown uid='1' noWrapper>
        <p id='child'>Child</p>
      </Dropdown>
    </Provider>,
    document.body
  )
  expect(document.body.querySelector('.dropdown-menu')).toBeDefined()
  expect(document.body.querySelector('#child')).toBeNull()
})

test('Dropdown should be open after toggle action', () => {
  render(
    <Provider store={store}>
      <Dropdown uid='1' noWrapper>
        <p id='child'>Child</p>
      </Dropdown>
    </Provider>,
    document.body
  )
  expect(store.getState()).toEqual({dropdown: null})
  document.body.querySelector('button').click()
  expect(store.getState()).toEqual({dropdown: '1'})
  expect(document.body.querySelector('#child')).toBeDefined()
})
