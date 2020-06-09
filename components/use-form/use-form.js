import { useCallback, useState } from 'react' // alias to 'preact/hooks'

// @TODO: No dependency on request. Use fetch instead.
import { request } from '@app-elements/use-request/request'
import Variant from 'variant-type'

const id = val => val
const hasProp = Object.prototype.hasOwnProperty
const SuccessShape = (v) => hasProp.call(v, 'formData') || hasProp.call(v, 'response')
const Errors = (v) => Object.keys(v).length > 0
const XhrShape = (v) => hasProp.call(v, 'response') || hasProp.call(v, 'status')
const Maybe = (check) => (v) => !v ? true : check(v)

const safelyGetErrorResponse = (jsonString) => {
  try {
    const json = JSON.parse(jsonString)
    return json
  } catch (_) {
    return {}
  }
}

export const FormState = Variant({
  Initial: [],
  Sending: [],
  Success: [SuccessShape],
  Failure: [Errors, Maybe(XhrShape)] // @TODO: migrate to `errors` array
})

export const useForm = (formProps) => {
  const {
    action,
    validations,
    invalidate,
    method = 'post',
    noAuth = false,
    initialData = {},
    preProcess = id
  } = formProps

  const fieldNames = new Set()
  const [formState, setFormState] = useState(FormState.Initial())
  const [formData, setFormData] = useState(initialData)
  const [formErrors, setFormErrors] = useState()

  const clear = () => {
    setFormState(FormState.Initial())
    setFormData(initialData)
    setFormErrors({})
  }

  const syncValue = useCallback((fieldName, handlerName = 'onChangeText') => {
    fieldNames.add(fieldName)
    return {
      value: formData[fieldName],
      [handlerName]: (value) => {
        if (formState.type === 'Failure') {
          setFormState(FormState.Initial())
          setFormErrors((formErrors || {})[fieldName])
        }
        if (formData[fieldName] !== value) {
          setFormData({ ...formData, [fieldName]: value })
        }
      },
      ...(hasProp.call(formErrors || {}, fieldName) ? { hint: formErrors[fieldName] } : {})
    }
  }, [formData, formErrors])

  const validate = (selectFields) => {
    const fields = selectFields || [...fieldNames]
    const errors = validations == null
      ? {}
      : fields.reduce((errs, name) => {
        if (hasProp.call(validations, name)) {
          const validationResult = validations[name](formData[name], formData)
          if (validationResult) {
            errs[name] = validationResult
          }
        }
        return errs
      }, {})
    const hasError = Object.keys(errors).length > 0
    if (hasError) {
      setFormErrors(errors)
      setFormState(FormState.Failure(errors, false))
    }
    return { hasError, errors }
  }

  const handleSubmit = () => {
    setFormState(FormState.Sending())
    const { hasError } = validate()
    if (hasError) return
    if (action == null) {
      setFormState(FormState.Success({ formData }))
    } else {
      const { promise, xhr } = request({
        endpoint: action,
        method,
        noAuth,
        data: preProcess(formData),
        invalidate: invalidate
      })
      promise
        .then((response) => {
          setFormState(FormState.Success({ response }))
        })
        .catch(() => {
          setFormData({})
          const errors = safelyGetErrorResponse(xhr.response)
          setFormErrors([...fieldNames].reduce((acc, field) => ({
            ...acc,
            ...(hasProp.call(errors, field) ? { [field]: errors[field].join(' ') } : {})
          }), {}))
          setFormState(FormState.Failure(errors, xhr))
        })
    }
  }

  return {
    formState,
    formData,
    formErrors,
    syncValue,
    validate,
    clear,
    handleSubmit
  }
}

