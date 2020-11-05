import { useEffect } from 'react' // alias to 'preact/hooks'

export const useMount = (onMount, onUnmount) => {
  useEffect(() => {
    onMount && onMount()
    return () => onUnmount && onUnmount()
  }, [])
}
