import React from 'react'

import WithState from '@app-elements/with-state'
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
  const Base = withState != null
    ? WithState
    : React.Component

  class Connect extends Base {
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
      const mappedState = withState != null ? this.state._mappedState : {}
      const allState = {
        ...mappedState,
        ...this.state
      }
      return withRequest != null
        ? <WithRequest
          request={withRequest(allState, this.props)}
          connectState={mappedState}
        >
          {({ isLoading, ...response }) =>
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
    Connect.defaultProps = { mapper: withState }
  }

  const passedComponentName = PassedComponent.displayName ||
    PassedComponent.name ||
    name ||
    'PassedComponent'
  Connect.displayName = `connect(${passedComponentName})`

  return Connect
}

export default connect
