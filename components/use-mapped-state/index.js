import { useEffect, useReducer, useRef } from 'react' // alias to 'preact/hooks'
import equal from '@app-elements/equal'

export function useMappedState (store, mapper) {
  const [, forceRender] = useReducer(s => s + 1, 0)
  const initialState = mapper(store.getState())
  const mappedStateRef = useRef(initialState)

  useEffect(() => {
    function checkForUpdates () {
      const nextState = mapper(store.getState())
      if (!equal(nextState, mappedStateRef.current)) {
        mappedStateRef.current = nextState
        forceRender({})
      }
    }

    checkForUpdates()
    const unsubscribe = store.subscribe(checkForUpdates)

    return () => unsubscribe()
  }, [store, mapper])

  return mapper(store.getState())
}
