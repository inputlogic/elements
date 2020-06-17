import { useMappedState } from '@app-elements/use-mapped-state'
import pathGet from '@wasmuth/path'
import pathSet from '@wasmuth/path-set'

export function useStorePath (store, path) {
  const value = useMappedState(store, pathGet(path))
  const setter = (val) => {
    const updated = pathSet(path, val, store.getState())
    store.setState(updated, { useStorePath: path })
  }

  return [value, setter]
}
