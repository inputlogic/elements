import W from 'wasmuth'
import withState from '@app-elements/with-state'
import LoadingIndicator from '@app-elements/loading-indicator'

export const SubmitButton = withState({
  mapper: (state, { formName }) => ({
    submitting: W.pathOr(false, [formName, 'submitting'], state)
  })
})(({
  // withState provided
  submitting,

  // User provided
  Loading,
  children,

  ...props
}) => {
  const loader = Loading != null
    ? <Loading />
    : <LoadingIndicator />
  return (
    <button {...props} type='submit' disabled={submitting}>
      {submitting && loader}
      {!submitting && (children || 'Submit')}
    </button>
  )
})

export default SubmitButton
