import W from 'wasmuth'
import React from 'react' // Can be aliased to `preact` in host project
import {connect} from 'unistore/react' // Can alias to `unistore/preact` in host project

import Level from '@app-elements/level'

import './style.less'

let storeRef // Will get populated by `getStoreReference`

const getStoreReference = actions => store => {
  storeRef = store
  return actions
}

export const actions = getStoreReference({
  toggle: ({dropdown}, uid) => {
    const isOpen = dropdown === uid
    return {dropdown: isOpen ? null : uid}
  }
})

const mapper = ({dropdown}, {uid}) => {
  if (!uid) {
    console.warn('<Dropdown> must include a uid prop.')
  }
  return {isOpen: dropdown === uid}
}

const Dropdown = connect(mapper, actions)(({
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
        ? <button className='btn btn-dropdown black-ghost-btn' onClick={ev => toggle(uid)}>
          <Level noPadding>{buttonText}</Level>
        </button>
        : <Trigger className='btn-dropdown' onClick={ev => toggle(uid)} />}
      {noWrapper
        ? isOpen && children
        : <div className={cls}>
          <div class='dropdown-arrow' />
          {children}
        </div>}
    </div>
  )
})

export default Dropdown

// DOM event to close all Dropdown's on off-click
const isDropdown = (el) =>
  (el.classList && el.classList.contains('dropdown-menu')) ||
  (el.classList && el.classList.contains('btn-dropdown'))

try {
  document.body.addEventListener('click', (ev) => {
    if (!storeRef) return
    const activeDropdown = W.path('dropdown', storeRef.getState())
    if (!activeDropdown) {
      return
    }
    let el = ev.target
    if (isDropdown(el)) return
    while (el.parentNode) {
      el = el.parentNode
      if (isDropdown(el)) return
    }
    storeRef.setState({dropdown: null})
  })
} catch (_) {}
