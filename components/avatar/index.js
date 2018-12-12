export default ({
  src,
  fullName = '',
  className = '',
  size = '100'
}) =>
  <div style={`font-size: ${size}%;`} className={`avatar-wrap ${className}`}>
    <div className={`avatar ${src && 'hasImage'}`}>
      {src
        ? <img src={src} alt={fullName} />
        : <div className='initial'>{fullName[0]}</div>
      }
    </div>
  </div>
