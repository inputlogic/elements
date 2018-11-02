import React from 'react'

import equal from '@app-elements/router/equal'

import makeRequest from './makeRequest'

const OK_TIME = 30000
const CACHE = {}

const cache = (endpoint, result) => {
  CACHE[endpoint] = {result, timestamp: Date.now()}
}

const validCache = endpoint => {
  const ts = CACHE[endpoint] && CACHE[endpoint].timestamp
  if (!ts) return false
  const diff = Date.now() - ts
  return diff < OK_TIME
}

export const clearCache = endpoint => {
  CACHE[endpoint] = null
}

export default class WithRequest extends React.Component {
  constructor (props) {
    super(props)
    this.state = {...(this.state || {}), isLoading: true, result: null, error: null}
    this._existing = null
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
      this.setState({result: CACHE[endpoint].result, isLoading: false})
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
