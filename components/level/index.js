import React from 'react'
import './style.less'

export const Level = ({
  children,
  ...props
}) =>
  <div {...props}>
    <div className='level'>
      {children}
    </div>
  </div>

export default Level
