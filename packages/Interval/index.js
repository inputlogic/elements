import React from 'react'

export default class Interval extends React.Component {
  componentDidMount () {
    if (!this.props.function) {
      console.warn('Interval should receive `function` prop.')
    }
    if (typeof window !== 'undefined') {
      console.log('setInterval')
      this._intervalId = window.setInterval(
        this.props.function,
        this.props.interval || 3000
      )
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
