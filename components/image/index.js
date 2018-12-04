import React from 'react' // Can be aliased to Preact in your project

export default class Image extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loaded: -1 // index of loaded src
    }
    this._imgs = []
    this._loadImage = this._loadImage.bind(this)
  }

  _loadImage (idx, src) {
    if (typeof document !== 'undefined') {
      const img = document.createElement('img')
      this._imgs.push(img)
      img.onload = () => {
        if (this.state.loaded < idx) {
          this.setState({loaded: idx})
        }
        this._removeImage(img)
      }
      img.onerror = () => {
        console.warn(`Failed to load srcs[${idx}] => ${src}`)
        this._removeImage(img)
      }
      img.src = src
    }
  }

  _removeImage (img) {
    if (img) {
      img.remove()
    }

    if ((this._imgs || []).includes(img)) {
      this._imgs = this._imgs.filter(i => i !== img)
    }
  }

  componentDidMount () {
    this.props.srcs.forEach((src, idx) => this._loadImage(idx, src))
  }

  componentWillUnmount () {
    if (this._imgs && this._imgs.length) {
      this._imgs.forEeach(img => this._removeImage(img))
    }
  }

  render () {
    const {
      srcs,
      unloadedSrc = '/images/blank-poster.gif',
      className,
      ...props
    } = this.props
    const {loaded} = this.state
    return loaded === -1
      ? <img
        src={unloadedSrc}
        className={`${className} image-loading`}
        {...props}
      />
      : <img
        src={srcs[loaded]}
        className={`${className} image-ready`}
        {...props}
      />
  }
}
