import React from 'react'
import styles from './style.less'

export function LoadingIndicator () {
  return (
    <span className={styles.loading}>
      <span>&bull;</span>
      <span>&bull;</span>
      <span>&bull;</span>
    </span>
  )
}

export default LoadingIndicator
