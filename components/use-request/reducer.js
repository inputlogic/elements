import without from '@wasmuth/without'

// Actions for managing the requests cache in your global store.

const CLEAR_REQUEST = 'CLEAR_REQUEST'
const CLEAR_REQUESTS = 'CLEAR_REQUESTS'

const clearRequest = (endpointOrUid) => {
  return { type: CLEAR_REQUEST, payload: { endpointOrUid } }
}

const clearRequests = (predicate) => {
  return { type: CLEAR_REQUESTS, payload: { predicate } }
}

export const actions = {
  clearRequest,
  clearRequests
}

export function requestsReducer (action, state) {
  const { type, payload } = action
  if (type === CLEAR_REQUEST) {
    return {
      ...state,
      requests: without([payload.endpointOrUid], state.requests)
    }
  } else if (type === CLEAR_REQUESTS) {
    const { predicate } = payload
    const matchedRequestKeys = Object.keys(state.requests).filter(predicate)
    return {
      ...state,
      requests: without(matchedRequestKeys, state.requests)
    }
  }
  return state
}
