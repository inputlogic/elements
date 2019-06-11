// Expose simple store Provider
global.getProvider = function () {
  function Provider (props) { this.getChildContext = () => ({ store: props.store }) }
  Provider.prototype.render = props => props.children
  return Provider
}
