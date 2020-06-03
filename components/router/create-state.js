import { useEffect, useState } from 'preact/compat'

export function createState (initialValue) {
  const value = Object.assign({}, initialValue || {})
  const cbs = []

  const onChange = () => cbs.forEach(cb => cb())

  return {
    get () {
      return Object.assign({}, value)
    },
    set (newValue) {
      Object.assign(value, newValue)
      onChange()
    },
    on (cb) {
      cbs.push(cb)
    },
    off (cb) {
      const idx = cbs.findIndex(fn => fn === cb)
      idx > -1 && cbs.splice(idx, 1)
    }
  }
}

// Small hook that wraps a createState instance.
export const useGlobalState = state => {
  const [local, setLocal] = useState(state.get())
  useEffect(() => {
    const cb = () => {
      setLocal(state.get())
    }
    state.on(cb)
    return () => state.off(cb)
  }, []) // the state ref should not change over time
  return local
}
