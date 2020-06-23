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

    _update () {
      const _mappedState = mapper(this._store.getState(), this.props)
      if (!equal(_mappedState, this.state._mappedState)) {
        this.setState({ _mappedState })
      }
    }

    componentWillUnmount () {
      this._unsubscribe()
    }

    componentDidUpdate () {
      this._update()
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
