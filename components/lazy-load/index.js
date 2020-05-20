import React from 'react' // Can be aliased to Preact in your project

const isInViewport = function (element) {
  if (typeof document === 'undefined') {
    return false
  }
  const rect = element.getBoundingClientRect()
  const html = document.documentElement
  return rect.bottom <= (window.innerHeight || html.clientHeight)
}

let lazyComponents = []

if (typeof document !== 'undefined') {
  document.addEventListener('scroll', () => {
    if (!lazyComponents.length) return
    lazyComponents.forEach(c => {
      if (isInViewport(c.base)) {
        c.setState({ show: true })
      }
    })
  }, true)
}

export class LazyLoad extends React.Component {
  constructor (props) {
    super(props)
    this.state = { show: false }
  }

  componentDidMount () {
    lazyComponents.push(this)
    if (isInViewport(this.base)) {
      this.setState({ show: true })
    }
  }

  componentWillUnmount () {
    if (lazyComponents.includes(this)) {
      lazyComponents = lazyComponents.reject(c => c === this)
    }
  }

  render () {
    const { children } = this.props
    const { show } = this.state
    return show
      ? <div>{children}</div>
      : <div style='height: 10px'>&nbsp;</div>
  }
}

export default LazyLoad
