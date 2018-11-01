import React from 'react'

export default class Interval extends React.Component {
  componentDidMount () {
    if (typeof window !== 'undefined') {
      this._intervalId = window.setInterval(this.props.function, this.props.interval)
    }
  }

  componentWillUnmount () {
    if (typeof window !== 'undefined') {
      window.clearInterval(this._intervalId)
    }
  }

  render () {
    return this.props.children
  }
}
