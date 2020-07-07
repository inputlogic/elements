import check from 'check-arg-types'
import findIndex from '@wasmuth/find-index'
import pathGet from '@wasmuth/path'
import pathSet from '@wasmuth/path-set'
import without from '@wasmuth/without'

const toType = check.prototype.toType

// Actions for managing the requests cache in your global store.

const APPEND_REQUEST = 'APPEND_REQUEST'
const CLEAR_REQUEST = 'CLEAR_REQUEST'
const CLEAR_REQUESTS = 'CLEAR_REQUESTS'
const PATCH_LIST_REQUEST = 'PATCH_LIST_REQUEST'

const appendRequest = ({ endpointOrUid, item, path = 'results' }) => ({
  type: APPEND_REQUEST,
  payload: { endpointOrUid, item, path }
})

const clearRequest = (endpointOrUid) => {
  return { type: CLEAR_REQUEST, payload: { endpointOrUid } }
}

const clearRequests = (predicate) => {
  return { type: CLEAR_REQUESTS, payload: { predicate } }
}

const patchListRequest = ({
  endpointOrUid,
  dataToMerge,
  matchKey = 'id',
  path = 'results'
}) => ({
  type: PATCH_LIST_REQUEST,
  payload: { endpointOrUid, dataToMerge, matchKey, path }
})

export const actions = {
  appendRequest,
  clearRequest,
  clearRequests,
  patchListRequest
}

export function requestsReducer (action, state) {
  const { type, payload } = action
  if (type === APPEND_REQUEST) {
    const { endpointOrUid, item, path } = payload
    const req = state.requests[endpointOrUid]
    if (!req) {
      console.warn(
        `${APPEND_REQUEST}: Attempting to append on non-existent request, "${endpointOrUid}"`)
      return state
    }
    const results = path && path.length ? pathGet(path)(req.result) : req.result
    if (!results || !results.length) {
      console.warn(
        `${APPEND_REQUEST}: Request result is not an array, "${endpointOrUid}"`)
      return state
    }
    const updatedResults = [...results, item]
    let updatePath = ['requests', endpointOrUid, 'result']
    if (path && path.length) {
      if (toType(path) === 'array') {
        updatePath = updatePath.concat(path)
      } else if (toType(path) === 'string') {
        updatePath = updatePath.concat(path).join('.')
      }
    }

    return pathSet(updatePath, updatedResults, state)
  } else if (type === CLEAR_REQUEST) {
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
  } else if (type === PATCH_LIST_REQUEST) {
    const { endpointOrUid, dataToMerge, matchKey, path } = payload
    const req = state.requests[endpointOrUid]
    if (!req) {
      console.warn(
        `${PATCH_LIST_REQUEST}: Attempting to patch non-existent request, "${endpointOrUid}"`)
      return state
    }
    const results = path && path.length ? pathGet(path)(req.result) : req.result
    if (!results || !results.length) {
      console.warn(
        `${PATCH_LIST_REQUEST}: Request result is not an array, "${endpointOrUid}"`)
      return state
    }
    const idx = findIndex(i => i[matchKey] === dataToMerge[matchKey], results)
    if (idx === undefined) {
      console.warn(
        `${PATCH_LIST_REQUEST}: Matching item not found, "${endpointOrUid}"`, results)
      return state
    }
    const foundItem = results[idx]
    const patchedResults = pathSet([idx], { ...foundItem, ...dataToMerge }, results)
    let updatePath = ['requests', endpointOrUid, 'result']
    if (path && path.length) {
      if (toType(path) === 'array') {
        updatePath = updatePath.concat(path)
      } else if (toType(path) === 'string') {
        updatePath = updatePath.concat(path.split('.'))
      }
    }

    return pathSet(updatePath, patchedResults, state)
  }

  return state
}
