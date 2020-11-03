import React, {
  createContext,
  createPortal,
  useEffect,
  useRef,
  Children,
  Component
} from 'react'

const Context = createContext('Modals')
const isOverlay = (el) =>
  (el.classList && el.classList.contains('ae-modal-container'))

class Portal extends Component {
  constructor (props) {
    super(props)
    this.el = document.createElement('div')
    this.modalRoot = document.getElementById('modals')
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
    this.modalRoot.appendChild(this.el)
  }

  componentWillUnmount () {
    this.modalRoot.removeChild(this.el)
  }

  render () {
    return createPortal(
      this.props.children,
      this.el
    )
  }
}

export function Modal ({
  className = '',
  hideClose = false,
  shouldCloseOnEsc = true,
  children
}) {
  const focusRef = useRef()
  useEffect(() => {
    if (focusRef.current) {
      focusRef.current.focus()
    }
  }, [])
  return (
    <Context.Consumer>
      {([_, setModal]) => {
        const closeModal = () => setModal(null)
        const onContainerClick = (event) => {
          if (isOverlay(event.target)) {
            closeModal()
          }
        }
        const handleKeyDown = (event) => {
          const pressedEsc = event.keyCode === 27
          if (pressedEsc) {
            event.stopPropagation()
            closeModal()
          }
        }
        return (
          <div
            className={'ae-modal-container ' + className}
            onClick={onContainerClick}
          >
            <div
              class='ae-modal-content'
              ref={focusRef}
              tabIndex='-1'
              onKeyDown={shouldCloseOnEsc && handleKeyDown}
            >
              {!hideClose &&
                <div className='close' onClick={closeModal}>
                  close
                </div>}
              {children}
            </div>
          </div>
        )
      }}
    </Context.Consumer>
  )
}

export function Modals ({ value, syncState, children }) {
  const setModalMaybe = (uid) => {
    if (uid !== value) {
      syncState && syncState(uid)
    }
  }

  if (value == null) {
    return null
  }

  let child
  Children.forEach(children, c => {
    if (c.type.name === value) {
      child = c
    }
  })

  if (value != null && child == null) {
    console.warn('No modal found for: ' + value)
  }

  return (
    <Context.Provider value={[value, setModalMaybe]}>
      <Portal>{child}</Portal>
    </Context.Provider>
  )
}
