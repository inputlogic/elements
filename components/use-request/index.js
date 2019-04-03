import { useEffect, useState } from 'preact/hooks'
import { request as makeRequest } from './request'

const OK_TIME = 30000
const _existing = {}

const validCache = ts => {
  if (!ts) return false
  const diff = Date.now() - ts
  return diff < OK_TIME
}

export function useRequest (store, endpoint) {
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

  const initialState = (
    ({ requests = {} }) => ({ request: requests[endpoint] || {} })
  )(store.getState())
  const { timestamp, result } = initialState
  const [request, setRequest] = useState(initialState)

  useEffect(() => {
    if (validCache(timestamp)) {
      setRequest({ result })
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
          setRequest({ result })
          delete _existing[endpoint]
        })
        .catch(error => {
          err(error)
          setRequest({ error })
          delete _existing[endpoint]
        })
    }
    return () => {
      if (_existing[endpoint]) {
        _existing[endpoint].abort()
        delete _existing[endpoint]
      }
    }
  })

  return { ...request, clear }
}
