import filter from '@wasmuth/filter'
import path from '@wasmuth/path'
import pick from '@wasmuth/pick'
import pipe from '@wasmuth/pipe'
import toPairs from '@wasmuth/to-pairs'
import React from 'react'

import './style.less'

const getPos = props => pipe(
  pick(['up', 'right', 'down', 'left']),
  filter(x => !!x),
  toPairs,
  path('0.0')
)(props)

export function Tooltip ({
  className = '',
  text = 'I am default text',
  length = 'medium',
  children,
  ...props
}) {
  return (
    <div
      className={`ae-tooltip ${className}`}
      data-tooltip={text}
      data-tooltip-pos={getPos(props)}
      data-tooltip-length={length}
      {...props}
    >
      {children}
    </div>
  )
}

export default Tooltip
