import { render } from 'preact'
import undom from 'undom'

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

const serializeJson = (el) => {
  if (el.nodeType === 3) return el.nodeValue
  let attributes = {}
  let a = el.attributes
  if (el.className) {
    attributes.class = el.className
  }
  for (let i = 0; i < a.length; i++) {
    attributes[a[i].name] = a[i].value
  }
  return {
    attributes,
    nodeName: String(el.nodeName).toLowerCase(),
    children: Array.from(el.childNodes).map(serializeJson)
  }
}

let doc
const preactDomRenderer = () => {
  if (!doc) {
    doc = undom()
    Object.assign(global, doc.defaultView)
  }

  let root
  const parent = doc.createElement('x-root')
  doc.body.appendChild(parent)

  const renderer = {
    render: (jsx) => {
      root = render(jsx, parent, root)
      return renderer
    },
    html: () => serializeHtml(root),
    json: () => serializeJson(root),
    tearDown: () => render(<nothing />, parent, root).remove()
  }
  return renderer
}

global.renderer = preactDomRenderer()
