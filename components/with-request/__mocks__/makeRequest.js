const users = {
  4: { name: 'Mark' },
  5: { name: 'Paul' }
}

function E (message) {
  this.message = message
  this.name = 'AtomException'
  this.toString = function () {
    return this.name + ': ' + this.message
  }
}

export default function makeRequest ({ endpoint }) {
  const promise = new Promise((resolve, reject) => {
    const userID = parseInt(endpoint.substr('/users/'.length), 10)
    process.nextTick(() =>
      users[userID]
        ? resolve(users[userID])
        : reject(new E('User with ' + userID + ' not found.'))
    )
  })
  const xhr = {
    abort: () => {
      console.log('mocked abort')
      promise.resolve(null)
    }
  }
  return { promise, xhr }
}
