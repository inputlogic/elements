import { useEffect, useRef, useState } from 'preact/hooks'
import { request as makeRequest } from './request'

const OK_TIME = 30000
const _existing = {}

const validCache = ts => {
  if (!ts) return false
  const diff = Date.now() - ts
  return diff < OK_TIME
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

  // We'll need to track if the component is mounted. We'll use
  // useRef which acts as instance variables without the class syntax.
  // And a useEffect call with no inputs, so it's only called once on mount.
  const mountedRef = useRef(false)
  useEffect(() => {
    mountedRef.current = true
    return () => (mountedRef.current = true)
  }, [])

  // Now, we'll put our mountedRef to use: only change state if the
  // component is mounted.
  const safeSetRequest = (...args) => mountedRef.current && setRequest(...args)

  // And some functions to manage this request in the global store
  const cache = (result) => store.setState({
    requests: {
      ...store.getState().requests || {},
      [endpoint]: { result, timestamp: Date.now() }
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

  useEffect(() => {
    if (validCache(timestamp)) {
      safeSetRequest({ result })
    } else {
      const token = store.getState().token
      const headers = {}
      if (token) {
        headers.Authorization = `Token ${token}`
      }
      const { xhr, promise } = makeRequest({ endpoint, headers })
      _existing[endpoint] = xhr
      promise
        .then(result => {
          cache(result)
          safeSetRequest({ result })
          delete _existing[endpoint]
        })
        .catch(error => {
          err(error)
          safeSetRequest({ error })
          delete _existing[endpoint]
        })
    }
    return () => {
      if (_existing[endpoint]) {
        _existing[endpoint].abort()
        delete _existing[endpoint]
      }
    }
  }, [endpoint])

  return { ...request, clear }
}
