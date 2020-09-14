import { useMappedState } from '@app-elements/use-mapped-state'
import pathGet from '@wasmuth/path'
import pathSet from '@wasmuth/path-set'

export function useStorePath (store, path) {
  const value = useMappedState(store, pathGet(path))
  const setter = (val) => {
    store.setState(pathSet(path, val, store.getState()))
  }

  return [value, setter]
}
