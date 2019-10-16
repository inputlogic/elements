import check from 'check-arg-types'
import equal from '@app-elements/equal'
import React from 'react'

import makeRequest from './makeRequest'

const toType = check.prototype.toType

let storeRef // Will get populated if WithRequest receives `store` via context

const _existing = {}

const OK_TIME = 30000

// cache result of request by endpoint, either in store or local cache object
const cache = (endpoint, result) => {
  storeRef.setState({
    requests: {
      ...storeRef.getState().requests || {},
      [endpoint]: { result, timestamp: Date.now() }
    }
  })
}

// get timestamp of an endpoint from store or local cache object
const getTimestamp = endpoint => {
  const reqs = storeRef.getState().requests || {}
  return reqs[endpoint] && reqs[endpoint].timestamp
}

// check if last saved timestamp for endpoint is not expired
const validCache = endpoint => {
  const ts = getTimestamp(endpoint)
  if (!ts) return false
  const diff = Date.now() - ts
  return diff < OK_TIME
}

// clear result for an endpoint from store or local cache object
export const clearCache = endpoint => {
  storeRef.setState({
    requests: {
      ...storeRef.getState().requests || {},
      [endpoint]: null
    }
  })
}

const withRequest = ({
  name,
  endpoint,
  parse
}) => PassedComponent => {
  class WithRequest extends React.Component {
    constructor (props, { store }) {
      super(props)
      storeRef = store
      this.state = { ...(this.state || {}), isLoading: true, result: null, error: null }
    }

    _performRequest (endpoint) {
      const token = this.context.store.getState().token
      const headers = {}
      if (token) {
        headers.Authorization = `Token ${token}`
      }
      const { xhr, promise } = makeRequest({ endpoint, headers })

      _existing[endpoint] = xhr

      promise
        .then(result => {
          cache(endpoint, result)
          delete _existing[endpoint]

          if (parse) {
            this.setState({ result: parse(result, this.state.result), isLoading: false })
          } else {
            this.setState({ result, isLoading: false })
          }
        })
        .catch(error => {
          this.setState({ error, isLoading: false })
        })
    }

    _loadResult (endpoint) {
      if (!endpoint) {
        return
      }

      if (_existing[endpoint] && !this.state.error) {
        _existing[endpoint].abort()
        delete _existing[endpoint]
      }

      if (validCache(endpoint)) {
        this.setState({
          result: storeRef.getState().requests[endpoint].result,
          isLoading: false
        })
      } else {
        this._performRequest(endpoint)
      }
    }

    componentDidMount () {
      this._loadResult(
        toType(endpoint) === 'function'
          ? endpoint(this.props)
          : endpoint
      )
    }

    shouldComponentUpdate (nextProps, nextState) {
      const nextEnpoint = toType(endpoint) === 'function'
        ? endpoint(nextProps)
        : endpoint
      const currEnpoint = toType(endpoint) === 'function'
        ? endpoint(this.props)
        : endpoint
      if (currEnpoint !== nextEnpoint) {
        return true
      }
      return !equal(nextState, this.state) || !equal(this.props, nextProps)
    }

    componentDidUpdate () {
      const currEnpoint = toType(endpoint) === 'function'
        ? endpoint(this.props)
        : endpoint
      if (!_existing[currEnpoint]) {
        this.setState({ isLoading: true })
        this._loadResult(currEnpoint)
      }
    }

    render () {
      return (
        <PassedComponent {...this.props} {...this.state} />
      )
    }
  }

  const passedComponentName = PassedComponent.displayName ||
    PassedComponent.name ||
    name ||
    'PassedComponent'
  WithRequest.displayName = `withRequest(${passedComponentName})`

  return WithRequest
}

export default withRequest
