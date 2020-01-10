import check from 'check-arg-types'
import map from '@wasmuth/map'

const toType = check.prototype.toType

let storage = null
let apiUrl = 'http://10.0.2.2:8000'

export const configure = ({ storage: uStorage, apiUrl: uApiUrl }) => {
  if (uStorage) storage = uStorage
  if (uApiUrl) apiUrl = uApiUrl
}

const safelyParse = (json, key) => {
  try {
    const parsed = JSON.parse(json)
    // console.log('safelyParse', parsed)
    return key != null ? parsed[key] : parsed
  } catch (_) {
    return json
  }
}

export const getAuthHeader = (headers = {}) => {
  const token = storage != null
    ? storage.getItem('token')
    : null
  if (token) {
    headers.Authorization = `Token ${token}`
  }
  return headers
}

const makeErr = (code, msg) => {
  const e = new Error(msg)
  e.code = code
  if (code === 401) {
    storage && storage.removeItem('token')
  }
  console.error('makeErr', { code, msg })
  return e
}

export default function makeRequest ({
  endpoint,
  url,
  method = 'get',
  data,
  headers,
  noAuth = false
}) {
  if (endpoint != null && endpoint.indexOf('http') === -1) {
    url = `${apiUrl}/${endpoint}`
  }

  if (url == null) {
    url = endpoint
  }

  const xhr = new window.XMLHttpRequest()
  const promise = new Promise((resolve, reject) => {
    xhr.open(method.toUpperCase(), url)

    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) return
      const badResponse = xhr.status !== 204 && xhr.response === ''
      badResponse || xhr.status >= 400
        ? reject(makeErr(xhr.status, safelyParse(xhr.response, 'detail')))
        : resolve(safelyParse(xhr.response))
    }
    xhr.onerror = () => reject(xhr)
    xhr.setRequestHeader('Content-Type', 'application/json')

    headers = !noAuth ? getAuthHeader(headers) : {}
    if (headers && toType(headers) === 'object') {
      map((k, v) => xhr.setRequestHeader(k, v), headers)
    }

    const dataType = toType(data)

    xhr.send(dataType === 'object' || dataType === 'array'
      ? JSON.stringify(data)
      : data)
  })
  return { xhr, promise }
}
