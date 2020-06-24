import { useEffect } from 'react' // alias to 'preact/hooks'

export function useDocumentClick (ref, cb) {
  useEffect(() => {
    const callback = (ev) => {
      cb && cb(ref.current && !ref.current.contains(ev.target))
    }

    document.addEventListener('mousedown', callback)
    document.addEventListener('touchstart', callback)

    return () => {
      document.removeEventListener('mousedown', callback)
      document.removeEventListener('touchstart', callback)
    }
  }, [ref.current])
}
