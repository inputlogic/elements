import React from 'react'

import WithState from '@app-elements/with-state'
import WithRequest from '@app-elements/with-request'

const buildActionsAndReducer = (withActions, store, componentName) => {
  const actionTypes = Object.keys(withActions).map(k => k.toUpperCase())
  function reducer (action, state) {
    if (actionTypes.includes(action.type)) {
      const lowerCaseType = action.type.toLowerCase()
      const args = action.payload.args || []
      return {
        ...state,
        ...withActions[lowerCaseType].apply(null, [state, ...(args || [])])
      }
    }
    return state
  }
  const actions = {}
  actionTypes.forEach(type => {
    actions[type.toLowerCase()] = (...args) =>
      store.dispatch({
        type,
        payload: {args},
        meta: {componentName}
      })
  })
  return {
    reducer,
    actions
  }
}

const connect = ({
  name = 'Connect',
  withActions,
  withState,
  withRequest,
  getStoreRef,
  ...rest
}) => PassedComponent => {
  const Base = withState != null
    ? WithState
    : React.Component

  class Connect extends Base {
    constructor (props, context) {
      super(props, context)
      if (context.store) {
        if (withActions) {
          const {reducer, actions} = buildActionsAndReducer(withActions, context.store, name)
          context.store.addReducer(reducer)
          this._actions = actions
        }
        if (getStoreRef) {
          getStoreRef(context.store)
        }
      }
      this.state = {...this.state}
    }

    render () {
      const mappedState = withState != null ? this.state._mappedState : {}
      const allState = {
        ...mappedState,
        ...this.state
      }
      return withRequest != null
        ? <WithRequest request={withRequest(allState, this.props)} connectState={mappedState}>
          {({isLoading, ...response}) =>
            isLoading
              ? null
              : <PassedComponent
                {...allState}
                {...response}
                {...this.props}
                {...rest}
                {...this._actions}
              />
          }
        </WithRequest>
        : <PassedComponent
          {...allState}
          {...this.props}
          {...rest}
          {...this._actions}
        />
    }
  }

  if (withState) {
    Connect.defaultProps = {mapper: withState}
  }

  return Connect
}

export default connect
