/* global Event fetch */
import { useEffect, useRef, useState } from 'react' // alias to 'preact/compat'

const id = val => val
const hasProp = Object.prototype.hasOwnProperty
const defaultOpts = { method: 'POST' }
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
  const fieldNames = new Set()

  // State

  const errorsRef = useRef({})
  const dataRef = useRef(initialData)
  const [formState, setFormState] = useState(INIT)

  // Functions

  const clear = (clearErrors = true) => {
    dataRef.current = Object.assign(
      {},
      Object.fromEntries(
        // needs to be null not undefined, to reset inputs
        Object.keys(dataRef.current).map(k => [k, null])
      ),
      initialData
    )
    clearErrors && (errorsRef.current = {})
    setFormState(INIT)
  }

  const field = (fieldName, {
    handlerName = 'onChange',
    errorClass = 'error',
    hintProp = 'title'
  } = {}) => {
    fieldNames.add(fieldName)
    console.log('field', fieldName, dataRef.current[fieldName])
    return {
      name: fieldName,
      value: dataRef.current[fieldName],
      [handlerName]: (ev) => {
        const value = ev instanceof Event ? ev.target.value : ev
        if (formState === FAILURE) {
          setFormState(INIT)
          errorsRef.current = (errorsRef.current || {})[fieldName]
        }
        if (dataRef.current[fieldName] !== value) {
          dataRef.current = { ...dataRef.current, [fieldName]: value }
        }
      },
      ...(hasProp.call(errorsRef.current || {}, fieldName)
        ? { [hintProp]: errorsRef.current[fieldName], className: errorClass }
        : {})
    }
  }

  const validate = (selectFields) => {
    const fields = selectFields || [...fieldNames]
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
    if (ev instanceof Event) {
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
      } else {
        setFormState(SUCCESS)
      }
    },
    [SUCCESS]: () => {
      if (!action) {
        onSuccess && onSuccess({ formData: dataRef.current })
      } else {
        const fetchOpts = Object.assign(
          { body: JSON.stringify(preProcess(dataRef.current)) },
          defaultOpts,
          opts
        )
        const handleRes = body => body
          .then(response => {
            onSuccess && onSuccess({ response })
          })
          .catch(err => console.error('handleRes', err))

        const handleErrRes = body => body
          .then(errors => {
            dataRef.current = {}
            errorsRef.current = [...fieldNames].reduce((acc, field) => ({
              ...acc,
              ...(hasProp.call(errors, field) ? { [field]: errors[field].join(' ') } : {})
            }), {})
            setFormState(FAILURE)
          })
          .catch(err => console.error('handleErrRes', err))

        fetch(action, fetchOpts)
          .then(res => {
            const json = res.json()
            if (!res.ok) {
              handleErrRes(json)
            } else {
              handleRes(json)
            }
          })
          .catch(err => {
            console.log('catch', err, err.message)
          })
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
