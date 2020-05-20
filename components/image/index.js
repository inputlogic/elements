import React from 'react' // Can be aliased to Preact in your project

export class Image extends React.Component {
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
          this.setState({ loaded: idx })
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
    const { srcs } = this.props
    if (srcs && srcs.length > 0) {
      for (let x = 0; x < srcs.length; x++) {
        this._loadImage(x, srcs[x])
      }
    }
  }

  componentWillUnmount () {
    if (this._imgs && this._imgs.length > 0) {
      for (let x = 0; x < this._imgs.length; x++) {
        this._removeImage(this._imgs[x])
      }
    }
  }

  render () {
    const {
      srcs,
      unloadedSrc = '/images/blank-poster.gif',
      className,
      ...props
    } = this.props
    const { loaded } = this.state
    return loaded === -1
      ? (
        <img
          src={unloadedSrc}
          className={`${className} image-loading`}
          {...props}
        />
      )
      : (
        <img
          src={srcs[loaded]}
          className={`${className} image-ready`}
          {...props}
        />
      )
  }
}

export default Image
