import React from 'react' // Can be aliased to Preact in your project

import styles from './style.less'

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

  render (_, { open, message, type }) {
    if (!ref) ref = this
    if (!message) return null
    const cls = [styles.bar, styles[type], open ? styles.open : styles.closed].filter(Boolean)
    return (
      <div className={cls.join(' ')}>
        <span className={styles.text}>
          {message}
        </span>
        <div className={styles.closeIcon} />
      </div>
    )
  }
}

export default Notification
