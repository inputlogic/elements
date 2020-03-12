import Type from 'variant-type'
import { useEffect, useState } from 'react' // alias to 'preact/hooks'

const noop = () => null

export function useVariantState ({ initial, states, transitions, effects }) {
  const States = Type(states)
  const [current, setCurrent] = useState(States[initial]())
  const checkState = (type) => current.type === type
  const transitionTo = (newState) => {
    newState = typeof newState === 'function' ? newState() : newState
    const from = current.type
    const to = newState.type
    if (from === to) {
      console.warn(`Attempting to transition to the same state, "${to}"`)
      return
    }
    if (!transitions[from].includes(to)) {
      throw new Error(`Cannot transition from "${from}" to "${to}".`)
    }
    setCurrent(newState)
  }

  useEffect(() => {
    if (!effects || !Object.keys(effects).length) return
    effects._ = effects._ || noop
    States.case(effects)(current)
  }, [current.type])

  const ret = { current, checkState, transitionTo }
  Object.keys(states).forEach(k => (ret[k] = States[k]))
  return ret
}
