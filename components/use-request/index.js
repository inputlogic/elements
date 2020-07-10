import { useEffect, useRef, useState } from 'react' // alias to 'preact/hooks'
import { useMappedState } from '@app-elements/use-mapped-state'
import { request as makeRequest } from './request'

export { actions, requestsReducer } from './reducer'

const OK_TIME = 30000
const _existing = {}

const validCache = (ts, maxTime = OK_TIME) => {
  if (!ts) return false
  const diff = Date.now() - ts
  return diff < maxTime
}

const requestPromise = ({ uid, endpoint, opts }) => {
  if (_existing[uid]) {
    const { promise, xhr } = _existing[uid]
    if (xhr.readyState !== 4) {
      return promise
    }
  }
  const { promise, xhr } = makeRequest({ endpoint, ...opts })
  _existing[uid] = { promise, xhr }
  return promise
}

export function useRequest (store, endpoint, options = {}) {
  // Take props out of options that don't need to be passed to the request.
  // Can be undefined, as they are not required.
  const { maxTime, uid = endpoint, ...opts } = options

  // Get existing request object in the global store, and stay in sync.
  const requestSelector = (state) => (state.requests || {})[uid] || {}
  const request = useMappedState(store, requestSelector)

  // We'll also track loading state locally
  const [isLoading, setIsLoading] = useState(true)

  // We'll need to track if the component is mounted. We'll use
  // useRef which acts as instance variables without the class syntax.
  // And a useEffect call with no inputs, so it's only called once on mount.
  const mountedRef = useRef(false)
  useEffect(() => {
    mountedRef.current = true
    return () => (mountedRef.current = false)
  }, [])

  // Only update local state if component is mounted
  const safeSetIsLoading = (...args) => mountedRef.current && setIsLoading(...args)

  // And some functions to manage this request in the global store
  const cache = (result) => store.setState({
    requests: {
      ...store.getState().requests || {},
      [uid]: { result, timestamp: Date.now(), error: null }
    }
  })

  const clear = () => store.setState({
    requests: {
      ...store.getState().requests || {},
      [uid]: null
    }
  })

  const err = (error) => store.setState({
    requests: {
      ...store.getState().requests || {},
      [uid]: {
        ...(store.getState().requests || {})[uid] || {},
        error
      }
    }
  })

  // Finally, making the actual request!
  const load = () => {
    safeSetIsLoading(true)
    if (validCache(request.timestamp, maxTime)) {
      safeSetIsLoading(false)
    } else if (endpoint != null) {
      const token = store.getState().token
      opts.headers = opts.headers || {}
      if (token && !opts.noAuth) {
        opts.headers.Authorization = `Token ${token}`
      }
      const promise = requestPromise({ uid, endpoint, opts })
      promise
        .then(result => {
          cache(result)
          safeSetIsLoading(false)
          delete _existing[uid]
        })
        .catch(error => {
          err(error)
          safeSetIsLoading(false)
          delete _existing[uid]
        })
    }
    return () => {
      if (_existing[uid] && _existing[uid].xhr) {
        // If the request is pre-contact with server, do not abort.
        // This solves strange race-condition in chrome, where the canceled
        // xhr contacts the server without the proper headers set, resulting in 415.
        // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState
        if (_existing[uid].xhr.readyState > 1) {
          _existing[uid].xhr.abort()
        }
        delete _existing[uid]
      }
    }
  }

  // Load data if a new uid/endpoint is passed down, or if timestamp changes.
  // ie. calling `clear()` will trigger this effect to call `load`.
  useEffect(load, [uid, request.timestamp])

  return {
    ...request,
    clear,
    // Ensure isLoading is never false when request fields are null.
    // This covers some async race conditions that can arise.
    isLoading: request.result == null && request.error == null ? true : isLoading
  }
}
