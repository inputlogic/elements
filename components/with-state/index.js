import React from 'react'
import equal from '@app-elements/equal'

const withState = optsOrMapper => PassedComponent => {
  let mapper
  let name
  if (typeof optsOrMapper === 'function') {
    mapper = optsOrMapper
  } else {
    mapper = optsOrMapper.mapper
    name = optsOrMapper.name
  }

  class WithState extends React.Component {
    constructor (props, { store }) {
      super(props)
      this._store = store
      this._update = this._update.bind(this)
      this._unsubscribe = store.subscribe(this._update)
      this.state = {
        ...this.state,
        _mappedState: mapper(store.getState(), props)
      }
    }

    _update (state) {
      this.setState({ _mappedState: mapper(this._store.getState(), this.props) })
    }

    componentWillUnmount () {
      this._unsubscribe()
    }

    shouldComponentUpdate (nextProps, nextState) {
      const mappedStateChanged = !equal(
        mapper(this._store.getState(), nextProps),
        this.state._mappedState
      )
      if (mappedStateChanged) {
        return true
      } else if (!equal(nextState, this.state)) {
        return true
      } else {
        return !equal(this.props, nextProps)
      }
    }

    componentDidUpdate () {
      const _mappedState = mapper(this._store.getState(), this.props)
      if (!equal(_mappedState, this.state._mappedState)) {
        this.setState({ _mappedState })
      }
    }

    render () {
      const { _mappedState } = this.state
      return (
        <PassedComponent
          store={this._store}
          {...this.props}
          {..._mappedState}
        />
      )
    }
  }

  const passedComponentName = PassedComponent.displayName ||
    PassedComponent.name ||
    name ||
    'PassedComponent'
  WithState.displayName = `withState(${passedComponentName})`

  return WithState
}

export default withState
