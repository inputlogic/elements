const users = {
  4: { name: 'Mark' },
  5: { name: 'Paul' }
}

export function request ({ endpoint }) {
  let resolveOuter
  const promise = new Promise((resolve, reject) => {
    resolveOuter = resolve
    const userID = parseInt(endpoint.substr('/users/'.length), 10)
    const err = '404'
    setTimeout(() => {
      if (endpoint === '/users') {
        resolve(users)
      } else {
        users[userID]
          ? resolve(users[userID])
          : reject(err)
      }
    }, 100)
  })
  const xhr = {
    abort: () => resolveOuter(null)
  }
  return { promise, xhr }
}
