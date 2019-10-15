const CALLED = {}

const nameToType = name => `useActions[${name}]`
const typeToName = type => {
  const res = /^useActions\[(.*?)\]$/gi.exec(type)
  if (res && res.length) {
    return res[res.length - 1]
  }
  return type
}

const buildActionsAndReducer = (actionDefs, store, componentName) => {
  const actionTypes = Object.keys(actionDefs).map(nameToType)
  function reducer (action, state) {
    if (actionTypes.includes(action.type)) {
      const args = action.payload.args || []
      const fnRef = typeToName(action.type)
      return {
        ...state,
        ...actionDefs[fnRef].apply(null, [state, ...(args || [])])
      }
    }
    return state
  }
  const actions = {}
  Object.keys(actionDefs).forEach(type => {
    actions[type] = (...args) =>
      store.dispatch({
        type: nameToType(type),
        payload: { args },
        meta: { componentName }
      })
  })
  return {
    reducer,
    actions
  }
}

export function useActions (store, actionDefs, componentName) {
  const actionNames = Object.keys(actionDefs)
  for (let x = 0; x < actionNames.length; x++) {
    const name = actionNames[x]

    if (CALLED[name]) {
      return CALLED[name]
    }

    const { reducer, actions } = buildActionsAndReducer(
      actionDefs,
      store,
      componentName
    )
    store.addReducer(reducer)
    CALLED[name] = actions

    return actions
  }
}
