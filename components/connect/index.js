import React from 'react'

import stateEnhancer from '@app-elements/with-state'
import WithRequest from '@app-elements/with-request'

import constToCamel from '@wasmuth/const-to-camel'
import camelToConst from '@wasmuth/camel-to-const'

const CALLED = {}

const buildActionsAndReducer = (withActions, store, componentName) => {
  const actionTypes = Object.keys(withActions).map(camelToConst)
  function reducer (action, state) {
    if (actionTypes.includes(action.type)) {
      const args = action.payload.args || []
      const fnRef = constToCamel(action.type)
      return {
        ...state,
        ...withActions[fnRef].apply(null, [state, ...(args || [])])
      }
    }
    return state
  }
  const actions = {}
  Object.keys(withActions).forEach(type => {
    actions[type] = (...args) =>
      store.dispatch({
        type: camelToConst(type),
        payload: { args },
        meta: { componentName }
      })
  })
  return {
    reducer,
    actions
  }
}

const connect = ({
  name,
  withActions,
  withState,
  withRequest,
  getStoreRef,
  ...rest
}) => PassedComponent => {
  class Connect extends React.Component {
    constructor (props, context) {
      super(props, context)
      if (context.store) {
        if (withActions) {
          if (!CALLED[name]) {
            const { reducer, actions } = buildActionsAndReducer(
              withActions,
              context.store,
              name
            )
            context.store.addReducer(reducer)
            this._actions = actions
            CALLED[name] = actions
          } else {
            this._actions = CALLED[name]
          }
        }
        if (getStoreRef) {
          getStoreRef(context.store)
        }
      }
      this.state = { ...this.state }
    }

    render () {
      return withRequest != null
        ? <WithRequest
          request={withRequest(this.state, this.props)}
          connectState={this.state}
        >
          {({ isLoading, ...response }) =>
            isLoading
              ? null
              : <PassedComponent
                {...this.state}
                {...response}
                {...this.props}
                {...rest}
                {...this._actions}
              />
          }
        </WithRequest>
        : <PassedComponent
          {...this.state}
          {...this.props}
          {...rest}
          {...this._actions}
        />
    }
  }

  const passedComponentName = PassedComponent.displayName ||
    PassedComponent.name ||
    name ||
    'PassedComponent'
  Connect.displayName = `connect(${passedComponentName})`

  return withState != null
    ? stateEnhancer({
      name: Connect.displayName,
      mapper: withState
    })(Connect)
    : Connect
}

export default connect
