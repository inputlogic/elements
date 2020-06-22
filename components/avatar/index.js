import React from 'react'

import { avatar, hasImage, image, initial } from './style.less'

export function Avatar ({ src, fullName = '', className = '', size = 100 }) {
  const cls = [avatar, src && hasImage, className].filter(Boolean)
  return (
    <div style={{ fontSize: `${size}%` }}>
      <div className={cls}>
        {src
          ? <img src={src} alt={fullName} className={image} />
          : <div className={initial}>{fullName[0]}</div>}
      </div>
    </div>
  )
}
