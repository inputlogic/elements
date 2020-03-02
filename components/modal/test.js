/* global getProvider beforeAll test expect */

import { render } from 'preact'
import createStore from 'atom'
import Modal, { Modals } from './index.js'

const store = createStore([], { modal: 'ExampleModal' })
const Provider = getProvider()
function ExampleModal () {
  return (
    <Modal>
      <div id='modal-content'>ExampleModal</div>
    </Modal>
  )
}
function SampleModal () {
  return (
    <Modal>
      <div id='modal-content'>SampleModal</div>
    </Modal>
  )
}

beforeAll(() => {
  const div = document.createElement('div')
  div.setAttribute('id', 'modals')
  document.body.appendChild(div)
})

test('Modal exports', () => {
  expect(typeof Modal).toBe('function')
  expect(typeof Modals).toBe('function')
})

test('Modal should render', () => {
  render(
    <Provider store={store}>
      <Modals>
        <ExampleModal />
      </Modals>
    </Provider>,
    document.body
  )
  expect(document.body.querySelector('#modals')).not.toBeNull()
  expect(document.body.querySelector('#modal-content').textContent).toBe('ExampleModal')
})

test('Modal should NOT render two modals', () => {
  render(
    <Provider store={store}>
      <Modals>
        <ExampleModal />
        <SampleModal />
      </Modals>
      <Modals>
        <ExampleModal />
        <SampleModal />
      </Modals>
    </Provider>,
    document.body
  )
  const elms = document.body.querySelectorAll('#modal-content')
  console.log({ elms }, elms.length)
})
