import W from 'wasmuth'
import { createPortal, Component } from 'react'

import connect from '@app-elements/connect'

import './style.less'

const modalRoot = document.getElementById('modals')

const isOverlay = (el) =>
  (el.classList && el.classList.contains('modal-container'))

export const actions = {
  onContainerClick: (state, event) => {
    if (isOverlay(event.target)) {
      return { modal: null }
    }
  },
  closeModal: (state) => ({ modal: null })
}

class Portal extends Component {
  constructor (props) {
    super(props)
    this.el = document.createElement('div')
  }

  componentDidMount () {
    // The portal element is inserted in the DOM tree after
    // the Modal's children are mounted, meaning that children
    // will be mounted on a detached DOM node. If a child
    // component requires to be attached to the DOM tree
    // immediately when mounted, for example to measure a
    // DOM node, or uses 'autoFocus' in a descendant, add
    // state to Modal and only render the children when Modal
    // is inserted in the DOM tree.
    modalRoot.appendChild(this.el)
  }

  componentWillUnmount () {
    modalRoot.removeChild(this.el)
  }

  render () {
    return createPortal(
      this.props.children,
      this.el
    )
  }
}

const Modal = connect({
  name: 'Modal',
  withActions: actions
})(({
  // connect actions
  onContainerClick,
  closeModal,

  // props
  className = '',
  hideClose = false,
  children
}) => (
  <Portal>
    <div
      class={'modal-container ' + className}
      onClick={onContainerClick}
    >
      <div class='modal-content'>
        {!hideClose &&
          <div className='close' onClick={closeModal}>
            close
          </div>
        }
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
  withState: ({ currentRoute, modal }) => ({ currentRoute, modal })
})(({ currentRoute, modal, closeModal, children }) => {
  const prevModal = prevState.modal
  const prevRouteName = W.path('currentRoute.name', prevState)

  prevState = { currentRoute, modal }

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

  const child = W.toType(children) === 'array'
    ? W.find(c => W.pathEq('type.name', modal, c), children)
    : children
  return child
})
