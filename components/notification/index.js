import React from 'react' // Can be aliased to Preact in your project

let ref

export function showNotification (notification) {
  ref && ref.setState({ ...ref.state, ...notification, open: true })
}

/**
 * Display a notification when `showNotification` is called.
 *
 * @TODO: Update to use store/global state.
 */
export class Notification extends React.Component {
  constructor (props) {
    super(props)
    this.state = { open: false, message: null, type: 'error', length: 3000 }
  }

  componentDidUpdate () {
    if (this.state.message) {
      this.timeout && clearTimeout(this.timeout)
      this.timeout = setTimeout(
        () => this.timeout && this.setState({ open: false }),
        this.state.length
      )
    }
  }

  componentWillUnmount () {
    this.timeout && clearTimeout(this.timeout)
  }

  render () {
    const { open, message, type } = this.state
    if (!ref) ref = this
    if (!message) return null
    return (
      <div className={`notification-bar ${type} ${open ? 'bar-open' : 'bar-closed'}`}>
        <span className='text'>
          {message}
        </span>
        <div className='close-icon' />
      </div>
    )
  }
}

export default Notification
