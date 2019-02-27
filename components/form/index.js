import React from 'react'

import makeRequest from '@app-elements/with-request/makeRequest'
import equal from '@app-elements/equal'

let storeRef // Will get populated if we receive `store` via context

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
  : child => child.nodeName != null

// These are the component names that we will sync values
// to our parent Form state.
let formFieldNames = [
  'InputText',
  'InputLocation',
  'TextInput',
  'TextArea',
  'Checkbox',
  'Select',
  'Radio',
  'Question',
  'DatePicker',
  'Slider'
]

export const addFieldNames = (...names) => {
  formFieldNames = formFieldNames.concat(names)
}

// `displayName` is lost in Release builds. It must be explicitly set
// on each of the above `formFieldNames` Component classes.
// See: https://github.com/facebook/react-native/issues/19106
const getNodeName = child =>
  child.type ? child.type.displayName : child.nodeName.name

const getProps = child => child.attributes || child.props || {}

// Is one of the above defined form fields, and has a `name`
// prop set. We can't sync state if the component doesn't have
// have a `name` prop set.
const isFormField = child => {
  const name = getNodeName(child)
  if (!formFieldNames.includes(name)) {
    return false
  } else if (getProps(child).name) {
    return true
  } else {
    console.warn(`Found Component '${name}' missing 'name' prop!`)
    return false
  }
}

// Our actual Form component
export default class Form extends React.Component {
  constructor (props, {store}) {
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

      const childProps = child.attributes || child.props
      if (childProps.isSubmit) {
        // if has isSubmit flag, treat as Submit button on ReactNative
        child = React.cloneElement(child, {formName, onPress: () => this._onSubmit()})
      } else if (isFormField(child)) {
        // If one of our nested Form Fields, add syncState prop.
        // If not ReactNative, override the onChange event to sync value.
        const newProps = {
          formName,
          text: this.state.values[childProps.name],
          value: this.state.values[childProps.name],
          syncState: state => this.setState({values: {
            ...this.state.values,
            [childProps.name]: state.value || state.text
          }})
        }
        if (!isReactNative) {
          newProps.onChange = ev => this.setState({values: {
            ...this.state.values,
            [childProps.name]: ev.target.value
          }})
        }
        child = React.cloneElement(child, newProps)
        // Store a reference to our fields, so we can validate them on submit
        this._fields[childProps.name] = child
      } else if (child.children || childProps.children) {
        // Recursively search children for more form fields
        child = React.cloneElement(child, {
          formName,
          children: this._updateChildFormFields(
            child.children || childProps.children,
            formName
          )
        })
      }

      return child
    })
  }

  _onSubmit (ev) {
    ev && ev.preventDefault()

    if (this.state.submitting) {
      return
    }

    this.setState({submitting: true})

    const fieldNames = Object.keys(this._fields)

    // @TODO: More validations, allow props to set them, etc.
    const errors = fieldNames.reduce((errs, name) => {
      const comp = this._fields[name]
      if (getProps(comp).required && !this.state.values[name]) {
        errs[name] = 'Is required.'
      }
      return errs
    }, {})

    const hasError = Object.keys(errors).length > 0
    hasError && this.setState({errors: {...this.state.errors, ...errors}})

    if (this.props.onSubmit) {
      this.props.onSubmit({
        hasError,
        errors: errors,
        data: this.state.values,
        state: this.state,
        clearValues: () => this.setState({
          values: this.props.initialData || {},
          errors: {}
        })
      })
    } else {
      if (!hasError) {
        const {xhr, promise} = makeRequest({
          endpoint: this.props.action,
          method: this.props.method,
          data: this.state.values,
          noAuth: this.props.noAuth || false,
          invalidate: this.props.invalidate
        })
        promise
          .then(r => {
            this.setState({submitting: false})
            this.props.onSuccess && this.props.onSuccess(r)
          })
          .catch(_ => {
            this.setState({submitting: false})
            this.props.onFailure && this.props.onFailure(xhr)
          })
      } else {
        this.setState({submitting: false})
        storeRef.setState({notification: {status: 'failure', message: 'Please complete all form fields!'}})
      }
    }
  }

  componentDidUpdate () {
    if (!equal(this.state, storeRef.getState()[this.props.name])) {
      storeRef.setState({[this.props.name]: this.state})
    }
  }

  render () {
    const children = this._updateChildFormFields(
      this.children || this.props.children,
      this.props.name
    )
    return isReactNative
      ? children
      : <form
        id={`Form-${this.props.name}`}
        key={this.props.name}
        onSubmit={this._onSubmit.bind(this)}
      >
        {children}
      </form>
  }
}
