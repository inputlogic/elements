/* eslint react/jsx-fragments: "off"  */

import React, { Fragment, createContext, useContext, useState } from 'react' // Can be aliased to `preact` in host project
import Level from '@app-elements/level'

import './style.less'

const Context = createContext('Dropdown')

function useDropdownState () {
  const [dropdown, setDropdown] = useState()
  return [dropdown, setDropdown]
}

export function useDropdown () {
  const value = useContext(Context)
  if (value == null) {
    throw new Error('Component must be wrapped with <DropdownProvider>')
  }
  return value
}

export function DropdownProvider ({ children }) {
  const value = useDropdownState()
  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function Dropdown ({
  uid,
  buttonText = 'Select',
  noWrapper = false,
  Trigger,
  children
}) {
  if (!uid) {
    throw new Error('<Dropdown> must include a uid prop.')
  }

  console.log('Dropdown', uid)

  return (
    <DropdownProvider>
      <Context.Consumer>
        {([dropdown, setDropdown]) => {
          const isOpen = dropdown === uid
          const cls = isOpen
            ? 'ae-dropdown-menu open'
            : isOpen === false
              ? 'ae-dropdown-menu close'
              : 'ae-dropdown-menu' // isOpen === null

          const handleClick = ev => {
            ev.preventDefault()
            ev.stopPropagation()
            setDropdown(isOpen ? null : uid)
          }

          return (
            <Fragment>
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
            </Fragment>
          )
        }}
      </Context.Consumer>Context
    </DropdownProvider>
  )
}

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
  let storeRef
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
