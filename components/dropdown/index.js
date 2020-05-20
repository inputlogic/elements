import React from 'react' // Can be aliased to `preact` in host project

import connect from '@app-elements/connect'
import Level from '@app-elements/level'

import './style.less'

let storeRef // Will get populated by `getStoreReference`

export const actions = {
  toggle: ({ dropdown }, uid) => {
    const isOpen = dropdown === uid
    return { dropdown: isOpen ? null : uid }
  }
}

const mapper = ({ dropdown }, { uid }) => {
  if (!uid) {
    console.warn('<Dropdown> must include a uid prop.')
  }
  return { isOpen: dropdown === uid }
}

export const Dropdown = connect({
  name: 'Dropdown',
  withActions: actions,
  withState: mapper,
  getStoreRef: store => { storeRef = store }
})(({
  // Store
  isOpen,
  toggle,

  // Props
  Trigger,
  uid,
  buttonText = 'Select',
  noWrapper = false,
  children
}) => {
  const cls = isOpen
    ? 'ae-dropdown-menu open'
    : isOpen === false
      ? 'ae-dropdown-menu close'
      : 'ae-dropdown-menu' // isOpen === null
  const handleClick = ev => {
    ev.preventDefault()
    ev.stopPropagation()
    toggle(uid)
  }
  return (
    <div>
      {Trigger === undefined
        ? (
          <button className='ae-btn-dropdown' onClick={handleClick}>
            <Level noPadding>{buttonText}</Level>
          </button>
        )
        : <Trigger className='ae-btn-dropdown' onClick={handleClick} />}
      {noWrapper
        ? isOpen && children
        : (
          <div className={cls}>
            {children}
          </div>
        )}
    </div>
  )
})

export default Dropdown

// DOM event to close all Dropdown's on off-click
const hasData = el => el.hasAttribute != null && el.hasAttribute('data-dropdown')
const checkClass = (className, el) => {
  if ((el.classList && el.classList.contains(className)) || hasData(el)) {
    return true
  }
  while (el.parentNode) {
    el = el.parentNode
    if ((el.classList && el.classList.contains(className)) || hasData(el)) {
      return true
    }
  }
  return false
}

const isClickable = (el) =>
  el.tagName === 'A' ||
  el.tagName === 'BUTTON'

try {
  document.body.addEventListener('click', (ev) => {
    if (!storeRef) return

    const activeDropdown = storeRef.getState().dropdown
    if (!activeDropdown) {
      return
    }

    const el = ev.target

    if (checkClass('ae-btn-dropdown', el)) {
      return
    }

    const withinDropdown = checkClass('ae-dropdown-menu', el)
    if (!withinDropdown || (withinDropdown && isClickable(el))) {
      storeRef.setState({ dropdown: null })
    }
  })
} catch (_) {}
