import pathOr from '@wasmuth/path-or'
import withState from '@app-elements/with-state'
import LoadingIndicator from '@app-elements/loading-indicator'

const isDisabled = (state, formName, requiredValues) => {
  const keys = Object.keys(pathOr({}, [formName, 'values'], state))
  if (keys.length === 0) {
    return true
  }
  if (!requiredValues) {
    return false
  }
  for (let x = 0; x < requiredValues.length; x++) {
    if (!keys.includes(requiredValues[x])) {
      return true
    }
  }
  return false
}

export const SubmitButton = withState({
  mapper: (state, { formName, requiredValues }) => ({
    submitting: pathOr(false, [formName, 'submitting'], state),
    disabled: isDisabled(state, formName, requiredValues)
  })
})(({
  // Form parent provided
  formName,

  // withState provided
  submitting,
  disabled,

  // User provided
  Loading,
  className,
  stopPropagation,
  title,
  children
}) => {
  const loader = Loading != null
    ? <Loading />
    : <LoadingIndicator />
  return (
    <button
      key={`${formName}-submit-button`}
      className={className}
      type='submit'
      disabled={disabled || submitting}
      title={title || 'Submit'}
      onClick={stopPropagation === true ? ev => ev.stopPropagation() : null}
    >
      {submitting && loader}
      {!submitting && (children || 'Submit')}
    </button>
  )
})

export default SubmitButton
