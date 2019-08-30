import { useEffect, useRef, useState } from 'react' // alias to 'preact/hooks'
import { request as makeRequest } from './request'

const OK_TIME = 30000
const _existing = {}

const validCache = ts => {
  if (!ts) return false
  const diff = Date.now() - ts
  return diff < OK_TIME
}

const requestPromise = ({ endpoint, headers }) => {
  if (_existing[endpoint]) {
    const { promise, xhr } = _existing[endpoint]
    if (xhr.readyState !== 4) {
      return promise
    }
  }
  const { promise, xhr } = makeRequest({ endpoint, headers })
  _existing[endpoint] = { promise, xhr }
  return promise
}

export function useRequest (store, endpoint) {
  // Check for an existing request object in the global store
  const initialState = (
    ({ requests = {} }) => ({ request: requests[endpoint] || {} })
  )(store.getState())
  const { timestamp, result } = initialState

  // And, create a stateful value with any existing request object
  // found in the global store.
  const [request, setRequest] = useState(initialState)

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
 
  // Now, we'll put our mountedRef to use: only change state if the
  // component is mounted.
  const safeSetRequest = (...args) => mountedRef.current && setRequest(...args)
  const safeSetIsLoading = (...args) => mountedRef.current && setIsLoading(...args)

  // And some functions to manage this request in the global store
  const cache = (result) => store.setState({
    requests: {
      ...store.getState().requests || {},
      [endpoint]: { result, timestamp: Date.now() }
    }
  })

  const clear = () => {
    store.setState({
      requests: {
        ...store.getState().requests || {},
        [endpoint]: null
      }
    })
    load()
  }

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
    if (validCache(timestamp)) {
      safeSetRequest({ result })
      safeSetIsLoading(false)
    } else {
      const token = store.getState().token
      const headers = {}
      if (token) {
        headers.Authorization = `Token ${token}`
      }
      const promise = requestPromise({ endpoint, headers })
      promise
        .then(result => {
          cache(result)
          safeSetRequest({ result, error: null })
          safeSetIsLoading(false)
          delete _existing[endpoint]
        })
        .catch(error => {
          err(error)
          safeSetRequest({ error })
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

  useEffect(load, [endpoint])

  return { ...request, clear, isLoading }
}
