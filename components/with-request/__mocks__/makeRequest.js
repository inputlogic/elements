const users = {
  4: { name: 'Mark' },
  5: { name: 'Paul' }
}

export default function makeRequest ({ endpoint }) {
  const promise = new Promise((resolve, reject) => {
    const userID = parseInt(endpoint.substr('/users/'.length), 10)
    const err = '404'
    setTimeout(() =>
      users[userID]
        ? resolve(users[userID])
        : reject(err)
    , 2000)
  })
  const xhr = {
    abort: () => {
      promise.resolve(null)
    }
  }
  return { promise, xhr }
}
