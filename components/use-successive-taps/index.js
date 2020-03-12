import { useRef } from 'react' // alias to 'preact/hooks'

export function useSuccessiveTaps (numTaps, delay, callback) {
  const tapsRef = useRef(0)
  const delayRef = useRef(null)

  function tapHandler () {
    if (!tapsRef || !delayRef) return
    const current = new Date()
    const past = delayRef.current != null ? delayRef.current : new Date()
    const diff = current.getTime() - past.getTime()
    if (diff < delay) {
      delayRef.current = new Date()
      tapsRef.current = tapsRef.current + 1
      if (tapsRef.current === numTaps) {
        callback && callback()
      }
    } else {
      delayRef.current = null
      tapsRef.current = 0
    }
  }

  return tapHandler
}
