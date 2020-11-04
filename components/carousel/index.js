import React from 'react' // Can be aliased to Preact in your project
import Level from '@app-elements/level'

// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Improving_scrolling_performance_with_passive_listeners
let passiveIfSupported = false
try {
  window.addEventListener('test', null,
    Object.defineProperty({}, 'passive', {
      get: function () {
        passiveIfSupported = { passive: true }
      }
    })
  )
} catch (err) {}

export class Carousel extends React.Component {
  static defaultProps = {
    tolerance: 100,
    mouseSupport: true
  }

  state = { active: this.props.active || 0, width: 0 }

  gesture = { x: [], y: [], match: '' }

  capture = (event) => {
    event.preventDefault()
    this.gesture.x.push(event.touches[0].clientX)
    this.gesture.y.push(event.touches[0].clientY)
  }

  compute = (event) => {
    const { tolerance } = this.props
    const xStart = this.gesture.x[0]
    const yStart = this.gesture.y[0]
    const xEnd = this.gesture.x.pop()
    const yEnd = this.gesture.y.pop()
    const xTravel = xEnd - xStart
    const yTravel = yEnd - yStart

    if (Math.abs(xTravel) < tolerance && yTravel > tolerance) {
      this.gesture.match = 'down'
    } else if (
      yTravel < tolerance &&
      Math.abs(xTravel) < tolerance &&
      Math.abs(yTravel) > tolerance
    ) {
      this.gesture.match = 'up'
    } else if (
      xTravel < tolerance &&
      Math.abs(xTravel) > tolerance &&
      Math.abs(yTravel) < tolerance
    ) {
      this.gesture.match = 'left'
    } else if (xTravel > tolerance && Math.abs(yTravel) < tolerance) {
      this.gesture.match = 'right'
    }

    if (this.gesture.match !== '') {
      this.onSwipe(this.gesture.match)
    }

    this.gesture.x = []
    this.gesture.y = []
    this.gesture.match = ''
  }

  onSwipe = (direction) => {
    if (this.props.onSwipe) {
      this.props.onSwipe(direction)
    }
    this.setState({ swipe: direction }, () => {
      if (direction === 'left') {
        this.handleNext()
      } else if (direction === 'right') {
        this.handlePrev()
      }
    })
  }

  handleNext = (ev) => {
    ev && ev.preventDefault()
    const active = this.state.active + this.state.numFit
    const n = active >= this.props.children.length - 1
      ? 0
      : this.state.active + 1
    this.setState({ active: n })
  }

  handlePrev = (ev) => {
    ev && ev.preventDefault()
    const n = this.state.active <= 0
      ? this.props.children.length - (this.state.numFit + 1)
      : this.state.active - 1
    this.setState({ active: n })
  }

  setActive = (active) => {
    return ev => {
      ev.preventDefault()
      this.setState({ active })
    }
  }

  getRef = (ref) => {
    if (!ref || this.ref) return
    this.ref = ref
    window.requestAnimationFrame(() => {
      const width = this.ref.offsetWidth
      const parent = this.ref.parentNode
      const parentWidth = parent.offsetWidth
      const numFit = parent != null
        ? Math.max(0, Math.floor(parent.offsetWidth / width) - 1)
        : 0
      this.setState({ width, parentWidth, numFit })
    })
  }

  getStyle = (idx, active) => {
    const { parentWidth, width } = this.state
    const style = parentWidth != null
      ? `width: ${parentWidth}px;`
      : ''
    if (active === 0 || idx >= active) {
      return style
    }
    return `${style} margin-left: -${width}px;`
  }

  getSlidesStyle = () => {
    return `width: ${this.state.parentWidth * this.props.children.length}px;`
  }

  componentDidMount () {
    this.base.addEventListener('touchstart', this.capture, passiveIfSupported)
    this.base.addEventListener('touchmove', this.capture, passiveIfSupported)
    this.base.addEventListener('touchend', this.compute, passiveIfSupported)
  }

  componentWillUnmount () {
    this.base.removeEventListener('touchstart', this.capture)
    this.base.removeEventListener('touchmove', this.capture)
    this.base.removeEventListener('touchend', this.compute)
  }

  render () {
    const {
      children,
      className = 'carousel-slide',
      noNav = false,
      withDots = false,
      wrapperClass = ''
    } = this.props
    const { active } = this.state

    return (
      <div className={`carousel ${wrapperClass}`}>
        <div>
          <div className='carousel-inner'>
            {!noNav &&
              <nav className='nav prev'>
                <button onClick={this.handlePrev} />
              </nav>}
            <div className='slides-wrapper'>
              <div className='slides' style={this.getSlidesStyle()}>
                {children.map((c, idx) =>
                  <div
                    key={`caurosel-${idx}`}
                    ref={(ref) => idx === 0 && this.getRef(ref)}
                    style={this.getStyle(idx, active)}
                    class={`${className}${idx === active ? ' active' : ''}`}
                  >
                    {c}
                  </div>
                )}
              </div>
            </div>
            {!noNav &&
              <nav className='nav next'>
                <button onClick={this.handleNext} />
              </nav>}
          </div>
          {withDots &&
            <Level className='carousel-dots'>
              {children.map((_, idx) =>
                <button
                  onClick={this.setActive(idx)}
                  key={`dots-${idx}`}
                  className={`${idx === active ? 'active' : ''}`}
                >
                  {idx}
                </button>
              )}
            </Level>}
        </div>
      </div>
    )
  }
}

export default Carousel
