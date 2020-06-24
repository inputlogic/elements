/* eslint react/jsx-fragments: "off"  */

import React, { Fragment, createContext, useEffect, useReducer } from 'react' // Can be aliased to `preact` in host project

const Context = createContext('Dropdown')
const providers = {}
let dropdown

function useDropdownState (uid) {
  const [, update] = useReducer(s => s + 1, 0)
  const setDropdown = uid => {
    if (uid !== dropdown) {
      dropdown = uid
      Object.values(providers).forEach(fn => fn())
    }
  }
  useEffect(() => {
    providers[uid] = update
    return () => {
      delete providers[uid]
    }
  }, [])
  return [dropdown, setDropdown]
}

export function DropdownProvider ({ uid, children }) {
  const value = useDropdownState(uid)
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

  return (
    <DropdownProvider uid={uid}>
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
                    {buttonText}
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
      </Context.Consumer>
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
  document.body.addEventListener('click', (ev) => {
    if (dropdown == null || !Object.values(providers).length) {
      return
    }

    const el = ev.target

    if (checkClass('ae-btn-dropdown', el)) {
      return
    }

    const withinDropdown = checkClass('ae-dropdown-menu', el)
    if (!withinDropdown || (withinDropdown && isClickable(el))) {
      dropdown = null
      Object.values(providers).forEach(fn => fn())
    }
  })
} catch (_) {}
