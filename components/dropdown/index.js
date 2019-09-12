import W from 'wasmuth'
import React from 'react' // Can be aliased to `preact` in host project

import connect from '@app-elements/connect'
import Level from '@app-elements/level'

import './style.less'

let storeRef // Will get populated by `getStoreReference`

export const actions = {
  toggle: ({ dropdown }, uid) => {
    const isOpen = dropdown === uid
    console.log('toggle', { dropdown, uid, isOpen })
    return { dropdown: isOpen ? null : uid }
  }
}

const mapper = ({ dropdown }, { uid }) => {
  if (!uid) {
    console.warn('<Dropdown> must include a uid prop.')
  }
  return { isOpen: dropdown === uid }
}

const Dropdown = connect({
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
    ? 'dropdown-menu open'
    : isOpen === false
      ? 'dropdown-menu close'
      : 'dropdown-menu' // isOpen === null
  return (
    <div>
      {Trigger === undefined
        ? (
          <button className='btn btn-dropdown black-ghost-btn' onClick={ev => toggle(uid)}>
            <Level noPadding>{buttonText}</Level>
          </button>
        )
        : <Trigger className='btn-dropdown' onClick={ev => toggle(uid)} />}
      {noWrapper
        ? isOpen && children
        : (
          <div className={cls}>
            <div class='dropdown-arrow' />
            {children}
          </div>
        )}
    </div>
  )
})

export default Dropdown

// DOM event to close all Dropdown's on off-click
const checkClass = (className, el) => {
  if (el.classList && el.classList.contains(className)) {
    return true
  }
  while (el.parentNode) {
    el = el.parentNode
    if (el.classList && el.classList.contains(className)) {
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

    const activeDropdown = W.path('dropdown', storeRef.getState())
    if (!activeDropdown) {
      return
    }

    const el = ev.target

    if (checkClass('btn-dropdown', el)) {
      return
    }

    const withinDropdown = checkClass('dropdown-menu', el)
    if (!withinDropdown || (withinDropdown && isClickable(el))) {
      console.log('CLOSING', { el: ev.target, withinDropdown })
      storeRef.setState({ dropdown: null })
    }
  })
} catch (_) {}
