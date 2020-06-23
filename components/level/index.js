import React from 'react'
import styles from './style.less'

export const Level = ({
  children,
  ...props
}) =>
  <div {...props}>
    <div className={styles.level}>
      {children}
    </div>
  </div>

export default Level
