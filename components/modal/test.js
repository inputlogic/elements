/* global getProvider beforeAll test expect */

import { render } from 'preact'
import createStore from 'atom'
import { Modal, Modals } from './index.js'

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
      <Modals value={store.getState().modal} syncState={modal => store.setState({ modal })}>
        <ExampleModal />
      </Modals>
    </Provider>,
    document.body
  )
  expect(document.body.querySelector('#modals')).not.toBeNull()
  expect(document.body.querySelector('#modal-content').textContent).toBe('ExampleModal')
})

test('Modal should not render more than one modal', (done) => {
  const listener = () => {
    // Wait for React to re-render with updated state
    render(
      <Provider store={store}>
        <Modals value={store.getState().modal} syncState={modal => store.setState({ modal })}>
          <ExampleModal />
          <SampleModal />
        </Modals>
      </Provider>,
      document.body
    )
    setTimeout(() => {
      expect(document.body.querySelectorAll('#modal-content').length).toBe(1)
      expect(document.body.querySelector('#modal-content').textContent).toBe('SampleModal')
      done()
    }, 2000)
    store.unsubscribe(listener)
  }
  store.subscribe(listener)

  render(
    <Provider store={store}>
      <Modals>
        <ExampleModal />
        <SampleModal />
      </Modals>
    </Provider>,
    document.body
  )

  expect(document.body.querySelector('#modals')).not.toBeNull()
  store.setState({ modal: 'SampleModal' })
})
