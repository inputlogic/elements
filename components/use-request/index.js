import { useEffect, useRef, useState } from 'react' // alias to 'preact/hooks'
import { useMappedState } from '@app-elements/use-mapped-state'
import { request as makeRequest } from './request'

const OK_TIME = 30000
const _existing = {}

const validCache = (ts, maxTime = OK_TIME) => {
  if (!ts) return false
  const diff = Date.now() - ts
  return diff < maxTime
}

const requestPromise = ({ endpoint, opts }) => {
  if (_existing[endpoint]) {
    const { promise, xhr } = _existing[endpoint]
    if (xhr.readyState !== 4) {
      return promise
    }
  }
  const { promise, xhr } = makeRequest({ endpoint, ...opts })
  _existing[endpoint] = { promise, xhr }
  return promise
}

export function useRequest (store, endpoint, opts = {}) {
  // Take props out of opts that don't need to be passed to the request.
  // Can be undefined, as they are not required.
  const { maxTime } = opts

  // Get existing request object in the global store, and stay in sync.
  const requestSelector = (state) => (state.requests || {})[endpoint] || {}
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
      [endpoint]: { result, timestamp: Date.now(), error: null }
    }
  })

  const clear = () => store.setState({
    requests: {
      ...store.getState().requests || {},
      [endpoint]: null
    }
  })

  const err = (error) => store.setState({
    requests: {
      ...store.getState().requests || {},
      [endpoint]: {
        ...(store.getState().requests || {})[endpoint] || {},
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
      if (token) {
        opts.headers.Authorization = `Token ${token}`
      }
      const promise = requestPromise({ endpoint, opts })
      promise
        .then(result => {
          cache(result)
          safeSetIsLoading(false)
          delete _existing[endpoint]
        })
        .catch(error => {
          err(error)
          safeSetIsLoading(false)
          delete _existing[endpoint]
        })
    }
    return () => {
      if (_existing[endpoint] && _existing[endpoint].xhr) {
        _existing[endpoint].xhr.abort()
        delete _existing[endpoint]
      }
    }
  }

  // Load data if a new endpoint is passed down, or if timestamp changes.
  // ie. calling `clear()` will trigger this effect to call `load`.
  useEffect(load, [endpoint, request.timestamp])

  return {
    ...request,
    clear,
    // Ensure isLoading is never false when request fields are null.
    // This covers some async race conditions that can arise.
    isLoading: request.result == null && request.error == null ? true : isLoading
  }
}
