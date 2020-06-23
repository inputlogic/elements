import filter from '@wasmuth/filter'
import pick from '@wasmuth/pick'
import pipe from '@wasmuth/pipe'
import React from 'react'

import './style.less'

const getPos = pipe(
  pick(['up', 'right', 'down', 'left']),
  filter(Boolean),
  Object.keys,
  ls => ls[0]
)

export function Tooltip ({
  text = 'I am default text',
  length = 'medium',
  className,
  children,
  ...props
}) {
  const cls = ['ae-tooltip', className].filter(Boolean).join(' ')
  return (
    <div
      className={cls}
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
