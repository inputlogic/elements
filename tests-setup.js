import { render } from 'preact'
import undom from 'undom'

// Expose simple store Provider
global.getProvider = function () {
  function Provider (props) { this.getChildContext = () => ({ store: props.store }) }
  Provider.prototype.render = props => props.children
  return Provider
}

// Custom undom renderer
// This let's us check changed html of undom
// without calling render more than once.
const VOID_ELEMENTS = [
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr'
]

const ESC = {
  '&': 'amp',
  '<': 'lt',
  '>': 'gt',
  '"': 'quot',
  "'": 'apos'
}

const enc = s => s.replace(/[&'"<>]/g, a => `&${ESC[a]};`)
const attr = (a) => {
  if (a.name === 'class' && a.value === '') {
    return ''
  }
  return ` ${a.name.replace(/^html/, '')}${a.value === 'true' || a.value === '' ? '' : `="${enc(a.value)}"`}`
}

const serializeHtml = (el) => {
  const { nodeType, nodeName, textContent, attributes, childNodes, innerHTML } = el
  const normalizedNodeName = nodeName.toLowerCase()
  if (nodeType === 3) {
    return enc(textContent)
  }
  const start = `<${normalizedNodeName}${Array.from(attributes).map(attr).join('')}`
  if (VOID_ELEMENTS.includes(normalizedNodeName)) {
    return `${start} />`
  }
  return `${start}>${innerHTML || Array.from(childNodes).map(serializeHtml).join('')}</${normalizedNodeName}>`
}

let doc
let root
let parent

global.renderer = {
  render: (jsx) => render(jsx, parent),
  html: () => serializeHtml(root.childNodes[0]),
  setup: () => {
    if (!doc) {
      doc = undom()
      Object.assign(global, doc.defaultView)
    }

    parent = doc.body
    root = doc.body
  },
  teardown: () => render(<nothing />, parent)
}
