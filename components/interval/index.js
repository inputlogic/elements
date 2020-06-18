import React from 'react'

export class Interval extends React.Component {
  componentDidMount () {
    if (!this.props.function) {
      console.warn('Interval should receive `function` prop.')
    }
    if (typeof setInterval !== 'undefined') {
      this._intervalId = setInterval(
        this.props.function,
        this.props.interval || 3000
      )
    }
  }

  componentWillUnmount () {
    if (typeof clearInterval !== 'undefined') {
      clearInterval(this._intervalId)
    }
  }

  render () {
    return this.props.children || null
  }
}

export default Interval
