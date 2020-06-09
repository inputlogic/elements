/* global afterEach test expect */

import { render } from 'preact'
import { Dropdown } from './index.js'

afterEach(() => {
  document.getElementsByTagName('html')[0].innerHTML = ''
})

test('Dropdown exports', () => {
  expect(typeof Dropdown).toBe('function')
})

test('Dropdown should throw without uid', () => {
  expect(() => {
    render(
      <Dropdown>
        <p>Child</p>
      </Dropdown>,
      document.body
    )
  }).toThrow()
})

test('Dropdown should render default trigger button', () => {
  render(
    <Dropdown uid='1'>
      <p>Child</p>
    </Dropdown>,
    document.body
  )
  expect(document.body.querySelector('button').textContent).toBe('Select')
})

test('Dropdown should be closed', () => {
  render(
    <Dropdown uid='1'>
      <p>Child</p>
    </Dropdown>,
    document.body
  )
  expect(document.body.querySelector('.dropdown-menu.open')).toBeNull()
  expect(document.body.querySelector('.dropdown-menu.close')).toBeDefined()
})

test('Dropdown should not render children', () => {
  render(
    <Dropdown uid='1' noWrapper>
      <p id='child'>Child</p>
    </Dropdown>,
    document.body
  )
  expect(document.body.querySelector('.dropdown-menu')).toBeDefined()
  expect(document.body.querySelector('#child')).toBeNull()
})

test('Dropdown should be open after toggle action', () => {
  render(
    <Dropdown uid='1' noWrapper>
      <p id='child'>Child</p>
    </Dropdown>,
    document.body
  )
  document.body.querySelector('button').click()
  expect(document.body.querySelector('#child')).toBeDefined()
  document.body.click()
  expect(document.body.querySelector('#child')).toBeNull()
})
