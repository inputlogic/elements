import W from 'wasmuth'
import Portal from 'preact-portal'

import connect from '@app-elements/connect'

import './style.less'

const isOverlay = (el) =>
  (el.classList && el.classList.contains('modal-container'))

export const actions = store => ({
  onContainerClick: (state, event) => {
    if (isOverlay(event.target)) {
      return {modal: null}
    }
  },
  closeModal: (state) => ({modal: null})
})

const Modal = connect({
  name: 'Modal',
  withActions: actions
})(({
  // connect actions
  onContainerClick,
  closeModal,

  // props
  className = '',
  children
}) => (
  <Portal into='body'>
    <div
      class={'modal-container ' + className}
      onClick={onContainerClick}
    >
      <div class='modal-content'>
        <div className='close' onClick={closeModal}>
          close
        </div>
        {children}
      </div>
    </div>
  </Portal>
))

export default Modal

/**
* Component that should wrap any modal instances.
*
*   <Modals>
*     <SomeModal />
*     <AnotherModal />
*   </Modals>
*/
let prevState = {}

export const Modals = connect({
  name: 'Modals',
  withActions: actions,
  withState: ({currentRoute, modal}) => ({currentRoute, modal})
})(({currentRoute, modal, closeModal, children}) => {
  const prevModal = prevState.modal
  const prevRouteName = W.path('currentRoute.name', prevState)

  prevState = {currentRoute, modal}

  if (!modal) {
    if (prevModal != null) {
      document.body.classList.remove('modal-open')
    }
    return
  } else if (modal !== prevModal) {
    document.body.classList.add('modal-open')
  }

  if (W.path('name', currentRoute || {}) !== prevRouteName) {
    closeModal()
  }

  const child = W.find(c => W.pathEq('nodeName.name', modal, c), children)
  return child
})
