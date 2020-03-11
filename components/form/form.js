import React from 'react'

import makeRequest from '@app-elements/with-request/makeRequest'
import equal from '@app-elements/equal'

let storeRef // Will get populated if we receive `store` via context

const hasProp = Object.prototype.hasOwnProperty

const isReactNative = typeof window !== 'undefined' &&
  window.navigator.product === 'ReactNative'

// children can be an array or object in React,
// but always array in Preact.
const compatMap = React.Children
  ? React.Children.map
  : (ls, fn) => Array.prototype.map.call(ls, fn)

// React method to skip textNodes, and Preact fallback.
const compatIsValid = React.isValidElement
  ? React.isValidElement
  : child => child && child.nodeName != null

const getProps = child => child.attributes || child.props || {}

// Is one of the above defined form fields, (or has attribute isFormField)
// and has a `name` prop set. We can't sync state if the component doesn't have
// have a `name` prop set.
const isFormField = child => {
  const props = getProps(child)
  if (props.native || props.isFormField === false) {
    return false
  } else if (props.name) {
    return true
  }
}

// Our actual Form component
export default class Form extends React.Component {
  constructor (props, { store }) {
    super(props)
    storeRef = store
    if (!this.props.name) throw new Error('<Form /> Components needs a `name` prop.')
    this.state = {
      values: this.props.initialData || {},
      errors: {},
      submitting: false
    }
    this._fields = {}
  }

  _updateChildFormFields (children, formName) {
    return compatMap(children, child => {
      if (!compatIsValid(child)) {
        return child
      }

      const childProps = child.attributes || child.props || {}
      if (childProps.isSubmit) {
        // if has isSubmit flag, treat as Submit button on ReactNative
        child = React.cloneElement(child, { formName, onPress: () => this._onSubmit() })
      } else if (isFormField(child)) {
        // If one of our nested Form Fields, add syncState prop.
        // If not ReactNative, override the onChange event to sync value.
        const newProps = {
          formName,
          text: this.state.values[childProps.name],
          value: this.state.values[childProps.name],
          syncState: state => this.setState({
            values: {
              ...this.state.values,
              [childProps.name]: state.value != null ? state.value : state.text
            }
          })
        }

        if (!isReactNative) {
          newProps.onChange = ev => this.setState({
            values: {
              ...this.state.values,
              [childProps.name]: ev.target.type === 'checkbox' ? ev.target.checked : ev.target.value
            }
          })
        }
        child = React.cloneElement(child, newProps)
        // Store a reference to our fields, so we can validate them on submit
        this._fields[childProps.name] = child
      } else if (child.children || childProps.children) {
        // Recursively search children for more form fields
        child = React.cloneElement(
          child,
          { formName },
          this._updateChildFormFields(child.children || childProps.children, formName)
        )
      }

      return child
    })
  }

  _onSubmit (ev) {
    ev && ev.preventDefault()

    if (this.state.submitting) {
      return
    }

    this.setState({ submitting: true })

    const fieldNames = Object.keys(this._fields)
    const { validations } = this.props

    const errors = fieldNames.reduce((errs, name) => {
      const comp = this._fields[name]
      if (getProps(comp).required && !this.state.values[name]) {
        errs[name] = 'Is required.'
      }
      if (validations && hasProp.call(validations, name)) {
        const validationResult = validations[name](this.state.values[name])
        if (validationResult) {
          errs[name] = validationResult
        }
      }
      return errs
    }, {})

    const hasError = Object.keys(errors).length > 0
    hasError && this.setState({ errors: { ...this.state.errors, ...errors } })

    const done = (errors = {}, values) => this.setState({
      values: values || this.props.initialData || {},
      submitting: false,
      errors
    })

    if (this.props.onSubmit) {
      this.props.onSubmit({
        hasError,
        done,
        errors: errors,
        data: this.state.values,
        state: this.state
      })
    } else {
      if (!hasError) {
        const { xhr, promise } = makeRequest({
          endpoint: this.props.action,
          method: this.props.method,
          data: this.state.values,
          noAuth: this.props.noAuth || false,
          invalidate: this.props.invalidate
        })
        promise
          .then(r => {
            this.setState({
              values: this.props.initialData || {},
              errors: {},
              submitting: false
            })
            this.props.onSuccess && this.props.onSuccess(r)
          })
          .catch(err => {
            this.setState({ submitting: false })
            this.props.onFailure && this.props.onFailure({ err, xhr, done })
          })
      } else {
        this.setState({ submitting: false })
        storeRef.setState({ notification: { status: 'failure', message: 'Please complete all form fields!' } })
      }
    }
  }

  componentDidMount () {
    if (!equal(this.state, storeRef.getState()[this.props.name])) {
      storeRef.setState({ [this.props.name]: this.state })
    }
  }

  componentDidUpdate () {
    if (!equal(this.state, storeRef.getState()[this.props.name])) {
      storeRef.setState({ [this.props.name]: this.state })
    }
  }

  render () {
    const children = this._updateChildFormFields(
      this.children || this.props.children,
      this.props.name
    )
    return isReactNative
      ? children
      : (
        <form
          id={`Form-${this.props.name}`}
          key={this.props.name}
          onSubmit={this._onSubmit.bind(this)}
        >
          {children}
        </form>
      )
  }
}
