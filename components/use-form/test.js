/* global afterEach test expect */

import { useForm } from './use-form'

afterEach(() => {
  document.body.innerHTML = ''
})

test('useForm exports', () => {
  expect(typeof useForm).toBe('function')
})
