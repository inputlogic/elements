/* global afterEach test expect */

import { render } from 'preact'
import { useForm } from './index'

afterEach(() => {
  document.body.innerHTML = ''
})

test('useForm exports', () => {
  expect(typeof useForm).toBe('function')
})

test('useForm should submit formData', (done) => {
  const MyComp = () => {
    const { submit, field } = useForm({
      initialData: {
        field1: 'init'
      },
      onSuccess: ({ formData }) => {
        expect(formData).toHaveProperty('field1', 'changed')
        done()
      }
    })
    const { onChange } = field('field1')
    onChange('changed')
    submit(null)
    return null
  }

  render(<MyComp />, document.body)
})

test('useForm should submit clear with new data', (done) => {
  const MyComp = () => {
    const { submit, field, clear } = useForm({
      initialData: {
        field1: 'init'
      },
      onSuccess: ({ formData }) => {
        expect(formData).toHaveProperty('field1', 'init')
        clear(false, { field1: 'cleared' })
        const { value } = field('field1')
        expect(value).toBe('cleared')
        done()
      }
    })
    submit(null)
    return null
  }

  render(<MyComp />, document.body)
})

test('useForm should submit to API endpoint', (done) => {
  const MyComp = () => {
    const { submit } = useForm({
      action: 'https://www.mocky.io/v2/5d28e8362c000068003edca8',
      initialData: {
        email: 'test@example.org',
        password: 'testpassword'
      },
      onSuccess: ({ response }) => {
        expect(response).toHaveProperty('userId')
        expect(response).toHaveProperty('token')
        done()
      }
    })
    submit(null)
    return null
  }

  render(<MyComp />, document.body)
})
