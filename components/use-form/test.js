/* global afterEach test expect */

import { useForm } from './index'

afterEach(() => {
  document.body.innerHTML = ''
})

test('useForm exports', () => {
  expect(typeof useForm).toBe('function')
})
