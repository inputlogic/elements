import filter from '@wasmuth/filter'
import pick from '@wasmuth/pick'
import pipe from '@wasmuth/pipe'
import React from 'react'

const getPos = pipe(
  pick(['up', 'right', 'down', 'left']),
  filter(Boolean),
  Object.keys,
  ls => ls[0]
)

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
