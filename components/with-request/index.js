import React from 'react'

import equal from '@app-elements/equal'

import makeRequest from './makeRequest'

let storeRef // Will get populated if WithRequest receives `store` via context

const OK_TIME = 30000

// cache result of request by endpoint, either in store or local cache object
const cache = (endpoint, result) => {
  storeRef.setState({
    requests: {
      ...storeRef.getState().requests || {},
      [endpoint]: {result, timestamp: Date.now()}
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

export default class WithRequest extends React.Component {
  constructor (props, {store}) {
    super(props)
    storeRef = store
    this._existing = null
    this.state = {...(this.state || {}), isLoading: true, result: null, error: null}
  }

  _performRequest (endpoint, parse) {
    const token = this.context.store.getState().token
    const headers = {}
    if (token) {
      headers.Authorization = `Token ${token}`
    }
    const {xhr, promise} = makeRequest({endpoint, headers})

    this._existing = xhr
    this._existing._endpoint = endpoint

    promise
      .then(result => {
        cache(endpoint, result)
        if (this.props.mutateResult) {
          this.setState({result: this.props.mutateResult(result, this.state.result), isLoading: false})
        } else {
          this.setState({result, isLoading: false})
        }
      })
      .catch(error => console.log('_performRequest', {error}) || this.setState({error, isLoading: false}))
  }

  _loadResult (props) {
    if (!props.request || !props.request.endpoint) {
      return
    }
    if (this._existing && !this.state.error) {
      this._existing.abort()
      this._existing = null
    }

    const {endpoint, parse} = props.request
    if (validCache(endpoint)) {
      this.setState({
        result: storeRef.getState().requests[endpoint].result,
        isLoading: false
      })
    } else {
      this._performRequest(endpoint, parse)
    }
  }

  componentDidMount () {
    this._loadResult(this.props)
  }

  shouldComponentUpdate (nextProps, nextState) {
    const nextEnpoint = (nextProps.request || {}).endpoint
    const currEnpoint = (this.props.request || {}).endpoint
    if (currEnpoint !== nextEnpoint) {
      return true
    }
    return !equal(nextState, this.state)
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (!this._existing) return
    if ((this.props.request || {}).endpoint !== this._existing._endpoint) {
      this._loadResult(this.props)
    }
  }

  render () {
    const child = this.children
      ? this.children[0]
      : this.props.children[0]
    if (!child || typeof child !== 'function') {
      console.log({child})
      throw new Error('WithRequest requires a function as its only child')
    }
    return child(this.state)
  }
}
