import path from '@wasmuth/path'
import withState from '@app-elements/with-state'

export const ErrorOrHint = withState({
  mapper: (state, { formName, name }) => ({
    error: path([formName, 'errors', name], state)
  })
})(({
  // User provided
  name,
  hint,
  className = '',

  // withState provided
  error,

  // parent <Form /> provided
  formName
}) => {
  !name && console.error('ErrorOrHint component requires `name` prop')
  !formName && console.error('ErrorOrHint component requires `formName` prop ', name)

  if (!!error || !!hint) {
    return (
      <span className={`field-hint ${error ? 'is-error' : ''} ${className}`}>
        {error || hint}
      </span>
    )
  }

  return null
})

export default ErrorOrHint
