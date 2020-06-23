import React from 'react'

import styles from './style.less'

export function Avatar ({ src, fullName = '', className = '', size = 100 }) {
  const cls = [styles.avatar, src && styles.hasImage, className].filter(Boolean)
  return (
    <div style={{ fontSize: `${size}%` }}>
      <div className={cls.join(' ')}>
        {src
          ? <img src={src} alt={fullName} className={styles.image} />
          : <div className={styles.initial}>{fullName[0]}</div>}
      </div>
    </div>
  )
}
