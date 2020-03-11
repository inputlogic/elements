import check from 'check-arg-types'

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
    return key != null ? parsed[key] : parsed
  } catch (_) {
    return json
  }
}

export const getAuthHeader = (headers = {}, noAuth) => new Promise((resolve, reject) => {
  if (storage == null || noAuth) {
    return resolve(headers)
  }
  const token = storage.getItem('token')
  if (token && typeof token.then === 'function') {
    token.then(t => {
      headers.Authorization = `Token ${token}`
      resolve(headers)
    })
  } else if (token) {
    headers.Authorization = `Token ${token}`
  }
  resolve(headers)
})

const makeErr = (code, msg) => {
  const e = new Error(msg)
  e.code = code
  if (code === 401 && storage != null) {
    storage.removeItem('token')
  }
  // console.error('makeErr', { code, msg })
  return e
}

export function request ({
  endpoint,
  url,
  method = 'get',
  data,
  headers,
  noAuth = false,
  contentType = 'application/json'
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
      if (xhr.readyState !== xhr.DONE) return
      const badResponse = xhr.status !== 204 && xhr.response === ''
      badResponse || xhr.status >= 400
        ? reject(makeErr(xhr.status, safelyParse(xhr.response, 'detail')))
        : resolve(safelyParse(xhr.response))
    }
    xhr.onerror = () => reject(xhr)

    contentType && xhr.setRequestHeader('Content-Type', contentType)

    getAuthHeader(headers, noAuth).then(headers => {
      // Our XHR may be aborted (by useRequest or user) and this reference
      // may be past the opened state, in which case it's too late to set headers.
      if (xhr.readyState !== xhr.OPENED) return
      if (headers && toType(headers) === 'object') {
        for (const k in headers) {
          xhr.setRequestHeader(k, headers[k])
        }
      }

      const dataType = toType(data)
      xhr.send(dataType === 'object' || dataType === 'array'
        ? JSON.stringify(data)
        : data)
    })
  })
  return { xhr, promise }
}

export default request
