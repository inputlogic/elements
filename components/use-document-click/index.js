import { useEffect } from 'react' // alias to 'preact/hooks'

// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Improving_scrolling_performance_with_passive_listeners
let passiveIfSupported = false
try {
  window.addEventListener('test', null,
    Object.defineProperty({}, 'passive', {
      get: function () {
        passiveIfSupported = { passive: true }
      }
    })
  )
} catch (err) {}

export function useDocumentClick (ref, cb) {
  useEffect(() => {
    const callback = (ev) => {
      cb && cb(ref.current && !ref.current.contains(ev.target))
    }

    document.addEventListener('mousedown', callback)
    document.addEventListener('touchstart', callback, passiveIfSupported)

    return () => {
      document.removeEventListener('mousedown', callback)
      document.removeEventListener('touchstart', callback)
    }
  }, [ref.current])
}
