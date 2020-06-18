import React from 'react'
import './style.less'

export function LoadingIndicator () {
  return (
    <span className='loading-ellipsis'>
      <span>&bull;</span>
      <span>&bull;</span>
      <span>&bull;</span>
    </span>
  )
}

export default LoadingIndicator
