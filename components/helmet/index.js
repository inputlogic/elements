import React, { Component } from 'react'
import { createPortal } from 'react-dom'

let refs = []

export const rewind = () => {
  const res = refs.reduce((acc, el) => ({ ...acc, ...el.props }), {})
  return res
}

class Portal extends Component {
  constructor (props) {
    super(props)
    this.el = new window.DocumentFragment()
  }

  componentDidMount () {
    // The portal element is inserted in the DOM tree after
    // the Modal's children are mounted, meaning that children
    // will be mounted on a detached DOM node. If a child
    // component requires to be attached to the DOM tree
    // immediately when mounted, for example to measure a
    // DOM node, or uses 'autoFocus' in a descendant, add
    // state to Modal and only render the children when Modal
    // is inserted in the DOM tree.
    document.head.appendChild(this.el.cloneNode(true))
  }

  componentWillUnmount () {
    const metas = document.head.querySelectorAll('[data-helmet]')
    for (let x = 0; x < metas.length; x++) {
      document.head.removeChild(metas[x])
    }
  }

  render () {
    const { children } = this.props
    const titleChild = children[0]

    if (titleChild) {
      const title = titleChild.props.children
      if (title !== document.title) {
        document.title = title
      }
    }

    const metaChildren = children[1]

    return createPortal(metaChildren, this.el)
  }
}

export class Helmet extends Component {
  constructor (props) {
    super(props)
    refs.push(this)
  }

  componentWillUnmount () {
    const refsWithout = refs.filter(c => c !== this)
    refs = refsWithout
    document.title = this._getTitle({})
  }

  _getTitle (props) {
    const { title, titleTemplate = '%s', defaultTitle } = { ...rewind(), ...props }
    return titleTemplate.replace('%s', title || defaultTitle || '')
  }

  _getMeta ({ meta = [] }) {
    // We need to clean up old metas manually, as Preact will not reconcile
    // direct children of <head>
    const metaNodes = document.head.querySelectorAll('[data-helmet]')
    if (metaNodes.length > meta.length) {
      for (let x = 0; x < metaNodes.length; x++) {
        const node = metaNodes[x]
        const key = node.getAttribute('name') || node.getAttribute('property')
        const metaVal = meta.find(x => (x.name || x.property) === key)
        if (metaVal && node.getAttribute('content') !== metaVal.content) {
          document.head.removeChild(node)
        }
      }
    }
    return meta.map(({ name, property, content }) =>
      <meta
        key={name || property}
        name={name}
        property={property}
        content={content}
        data-helmet
      />
    )
  }

  render () {
    return (
      <Portal>
        <title data-helmet='true'>{this._getTitle(this.props)}</title>
        {this._getMeta(this.props)}
      </Portal>
    )
  }
}

export default Helmet
