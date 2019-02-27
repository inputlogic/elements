/* global jest test expect */

import { render } from 'preact'

import Interval from './index.js'

jest.useFakeTimers() // https://jestjs.io/docs/en/timer-mocks

test('Interval exports', () => {
  expect(typeof Interval).toBe('function')
})

test('Interval should trigger function at interval', () => {
  const callback = jest.fn(x => x)

  render(
    <Interval function={callback}>
      <p>Child</p>
    </Interval>,
    document.body
  )

  expect(callback).not.toBeCalled()

  jest.runOnlyPendingTimers()

  expect(callback).toBeCalled()
  expect(callback).toHaveBeenCalledTimes(1)
})

test('Interval should render children', () => {
  const callback = jest.fn(x => x)

  render(
    <Interval function={callback}>
      <p id='child'>Child</p>
    </Interval>,
    document.body
  )

  expect(document.body.querySelector('#child')).toBeDefined()
})

test('Interval should render null if no children', () => {
  const callback = jest.fn(x => x)

  render(
    <Interval function={callback} />,
    document.body
  )

  expect(document.body.querySelector('#child')).toBeDefined()
})
