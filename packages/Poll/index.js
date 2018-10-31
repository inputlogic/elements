import React from 'react'

export default class Poll extends React.Component {
  constructor (props) {
    super(props)
    if (typeof window !== 'undefined') {
      this._pollId = window.setInterval(this.props.function, this.props.interval)
    }
  }

  componentWillUnmount () {
    if (typeof window !== 'undefined') {
      window.clearInterval(this._pollId)
    }
  }

  render () {
    const child = this.props.children || this.props.children[0]
    if (!child || typeof child !== 'function') {
      console.log({child})
      throw new Error('Poll requires a function as its only child')
    }
    return child({})
  }
}
