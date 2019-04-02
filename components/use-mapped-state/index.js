import { useState, useEffect } from 'preact/hooks'
import equal from '@app-elements/equal'

export default function useMappedState (store, mapper) {
  // const store = useContext(MyContext)
  const initialState = mapper(store.getState())
  const [mappedState, setMappedState] = useState(initialState)

  useEffect(() => {
    const handleStateChange = () => {
      const nextState = mapper(store.getState())
      console.log({ nextState }, store.getState())
      if (!equal(nextState, mappedState)) {
        setMappedState(nextState)
      }
    }
    const unsubscribe = store.subscribe(handleStateChange)
    return () => unsubscribe()
  })

  return mappedState
}
