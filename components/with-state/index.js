import React from 'react'
import equal from '@app-elements/equal'

export default class WithState extends React.Component {
  constructor (props, {store}) {
    super(props)
    this._store = store
    this._update = this._update.bind(this)
    this._unsubscribe = store.subscribe(this._update)
    this.state = {...this.state, _mappedState: props.mapper(store.getState(), props)}
  }

  _update (state) {
    this.setState({_mappedState: this.props.mapper(this._store.getState(), this.props)})
  }

  componentWillUnmount () {
    this._unsubscribe()
  }

  shouldComponentUpdate (nextProps, nextState) {
    const mappedStateChanged = !equal(
      nextProps.mapper(nextState, nextProps),
      this.state._mappedState
    )
    if (mappedStateChanged) {
      return true
    } else if (!equal(nextState, this.state)) {
      return true
    }
    return false
  }

  componentDidUpdate () {
    const _mappedState = this.props.mapper(this._store.getState(), this.props)
    if (!equal(_mappedState, this.state._mappedState)) {
      this.setState({_mappedState})
    }
  }

  render () {
    const {_mappedState} = this.state
    const child = this.children
      ? this.children[0]
      : this.props.children[0]
    if (!child || typeof child !== 'function') {
      throw new Error('WithState requires a function as its only child')
    }
    return child({..._mappedState, store: this._store})
  }
}
