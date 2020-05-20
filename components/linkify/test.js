/* global test expect */

import { render } from 'preact'

import { Linkify } from './index.js'

test('Linkify exports', () => {
  expect(typeof Linkify).toBe('function')
})

test('Linkify should render text', () => {
  render(
    <Linkify text='Hello' />,
    document.body
  )

  expect(document.body.textContent).toBe('Hello')
})

test('Linkify should convert URLs to anchors', () => {
  render(
    <Linkify text='Hello, google.com is neat, but https://www.inputlogic.ca is neater. I guess www.github.com is OK too.' />,
    document.body
  )

  const anchors = document.querySelectorAll('a')

  expect(anchors.length).toBe(3)
})
