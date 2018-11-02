import {map} from 'wasmuth'

export {request}

export default function request ({url, method = 'GET', data = null, headers}) {
  const xhr = new window.XMLHttpRequest()
  const promise = new Promise((resolve, reject) => {
    xhr.open(method, url)
    xhr.onload = () => xhr.status >= 400
      ? reject(xhr)
      : resolve(parse(xhr.responseText))
    xhr.onerror = () => reject(xhr)
    xhr.setRequestHeader('Content-Type', 'application/json')
    if (headers && typeof headers === 'object') {
      map((k, v) => xhr.setRequestHeader(k, v), headers)
    }
    xhr.send(typeof data === 'object' ? JSON.stringify(data) : data)
  })
  return {xhr, promise}
}

const parse = res => {
  try {
    return JSON.parse(res)
  } catch (_) {
    return res
  }
}
