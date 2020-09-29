import { useEffect, useRef, useState } from 'react' // alias to 'preact/compat'
import { request } from '@app-elements/use-request/request'

const id = val => val
const hasProp = Object.prototype.hasOwnProperty
const getVal = valOrEvent =>
  valOrEvent != null && valOrEvent.target != null
    ? valOrEvent.target.value
    : valOrEvent
const defaultOpts = {
  method: 'post'
}
const INIT = 'INIT'
const SUBMIT = 'SUBMIT'
const SUCCESS = 'SUCCESS'
const FAILURE = 'FAILURE'

export const useForm = ({
  action,
  validations,
  onSuccess,
  onFailure,
  opts = {},
  initialData = {},
  preProcess = id
}) => {
  // State

  const dataRef = useRef(initialData)
  const errorsRef = useRef({})
  const fieldNames = useRef([])
  const [formState, setFormState] = useState(INIT)

  // Functions

  const clear = (clearErrors = true, newFormValues) => {
    dataRef.current = Object.assign(
      {},
      Object.fromEntries(
        // needs to be null not undefined, to reset inputs
        Object.keys(dataRef.current).map(k => [k, null])
      ),
      newFormValues || initialData
    )
    clearErrors && (errorsRef.current = {})
    setFormState(INIT)
  }

  const field = (fieldName, {
    handlerName = 'onChange',
    errorClass = 'error',
    hintProp = 'title'
  } = {}) => {
    if (!fieldNames.current.includes(fieldName)) {
      fieldNames.current = [fieldName].concat(fieldNames.current)
    }
    const fieldProps = {}
    fieldProps.name = fieldName
    fieldProps.value = dataRef.current[fieldName]
    fieldProps[handlerName] = (ev) => {
      const value = getVal(ev)
      if (formState === FAILURE) {
        setFormState(INIT)
        errorsRef.current = (errorsRef.current || {})[fieldName]
      }
      if (dataRef.current[fieldName] !== value) {
        const valueObj = {}
        valueObj[fieldName] = value
        Object.assign(dataRef.current, valueObj)
      }
    }
    if (hasProp.call(errorsRef.current || {}, fieldName)) {
      const fieldErr = errorsRef.current[fieldName]
      fieldProps[hintProp] = Array.isArray(fieldErr) ? fieldErr.join(' ') : fieldErr
      fieldProps.className = errorClass
    }
    return fieldProps
  }

  const validate = (selectFields) => {
    const fields = selectFields || fieldNames.current
    const errors = validations == null
      ? {}
      : fields.reduce((errs, name) => {
        if (hasProp.call(validations, name)) {
          const validationResult = validations[name](dataRef.current[name], dataRef.current)
          if (validationResult) {
            errs[name] = validationResult
          }
        }
        return errs
      }, {})
    const hasError = Object.keys(errors).length > 0
    return { hasError, errors }
  }

  const submit = (ev) => {
    if (ev != null && hasProp.call(ev, 'preventDefault')) {
      ev.preventDefault()
    }
    setFormState(SUBMIT)
  }

  // State effects

  const effects = {
    [SUBMIT]: () => {
      const { hasError, errors } = validate()
      if (hasError) {
        errorsRef.current = errors
        setFormState(FAILURE)
      } else if (action) {
        const reqOpts = Object.assign(
          {},
          defaultOpts,
          opts,
          {
            endpoint: action,
            data: preProcess(dataRef.current)
          }
        )
        const { xhr, promise } = request(reqOpts)
        promise
          .then(response => {
            setFormState(SUCCESS)
            onSuccess && onSuccess({ response })
          })
          .catch(errors => {
            errorsRef.current = Object.assign({}, { xhr }, errors)
            setFormState(FAILURE)
          })
      } else {
        setFormState(SUCCESS)
      }
    },
    [SUCCESS]: () => {
      if (!action) {
        onSuccess && onSuccess({ formData: dataRef.current })
      }
    },
    [FAILURE]: () => {
      onFailure && onFailure(errorsRef.current)
    }
  }

  useEffect(() => {
    effects[formState] && effects[formState]()
  }, [effects, formState])

  return {
    field,
    validate,
    submit,
    clear,
    formData: dataRef.current,
    isSubmitting: formState === SUBMIT
  }
}
