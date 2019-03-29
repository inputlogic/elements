# Form

Handle your Forms with React and global state!

## Installation

`npm install --save @app-elements/form`

## Usage

```javascript
import Form from '@app-elements/form'
import { routeTo } from '@app-elements/router'

const TextInput = ({ ...props }) =>
  <input type='text' {...props} />

const Login = () => {
  const formProps = {
    name: 'LoginForm',
    action: 'auth/login',
    method: 'post',
    noAuth: true,
    initialData: {
      username: 'example'
    },
    onSuccess: ({ token, userId }) => {
      setState(
        { token, userId }
        () => routeTo('dashboard')
      )
    },
    onFailure: (err) => {
      console.log('onFailure', err)
      setState({
        notification: { status: 'failure', message: 'We were not able to log you in!' }
      })
    }
  }

  return (
    <Form {...formProps}>
      // Each form input requires a `name` prop. It will be the key set on the Form state.
      // In this case, the form name is `LoginForm`, so:
      //   {
      //     LoginForm: {
      //       email: '',
      //       username: '',
      //       password: ''
      //     }
      //   }
      <TextInput name='email' />
      <input isFormField name='username' />
      <TextInput name='password' />
      <button type='submit'>Login</button>
    </Form>
  )
}

export default Login
```

`<Form />` will automatically iterate it's `children` and if any of them match a `formFieldNames` then it will automatically sync the data from that form input.

```javascript
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
```

You can also add additional field names:

```javacript
import { addFieldNames } from '@app-elements/form'

addFieldNames('MyCoolField', 'NeatoField', 'BurritoField')
```

Or add `isFormField` attribute:

```javacript
const MyCustomInput => <input isFormField name='hello' />
```

```javacript
import { addFieldNames } from '@app-elements/form'

addFieldNames('MyCoolField', 'NeatoField', 'BurritoField')
```

In the future, we should probably just automatically sync all native web form elements (input, select, checkbox, textarea, etc.. 🤷‍♀️)

### Difference between `onSubmit` and `action, method, noAuth, onSuccess, onFailure`

There are two main ways to use `Form`. The first is the more bare-bones `onSubmit`. When a user submits your form, if `onSubmit` was defined, it will be called with `{ hasError, errors, data, done }` and you are left to determine what you want to do with the potential `errors` or form `data`.

The second way, is a convience around sending the form data to an API endpoint. You define the endpoint via `action` (named after native web form attribute) as well as the `method`. And you define the `onSuccess` and `onFailure` callbacks.

In both cases, any provided `validations` are run. With `onSubmit` any failed validations will be contained in the `errors` object. With the `action` way, the API request will **not** be made if there are any failed validations.

## Props

| Prop                   | Type       | Default       | Description         |
|------------------------|------------|---------------|---------------------|
| **`name`**             | _String_   | _None_        | The name of the form. Will be used as the parent key in global state.
| **`initialData`**      | _Object_   | _None_        | An object to prefill the form with. Each key should correspond to the name of a field.
| **`validations`**      | _Object_   | _None_        | An object of field validations. Each key should match a field name and the value should be a function that accepts the current field value and return null if valid, or a string describing the error if invalid.
| **`action`**           | _String_   | _None_        | URL to send form data to when submitted
| **`method`**           | _String_   | _None_        | The HTTP method to use when sending data to the `action` URL
| **`noAuth`**           | _Boolean_  | `false`       | If the request should *not* include auth token in the headers
| **`onSuccess`**        | _Function_ | _None_        | The function to call if the request was successful, called with the JSON response from the server
| **`onFailure`**        | _Function_ | _None_        | The function to call if the request failed, called with the caught error
| **`onSubmit`**         | _Function_ | _None_        | If set, `{ action, method, noAuth, onSuccess, onFailure }` will be ignored. Instead, `onSubmit` will be called with `{ hasError, errors, data, done }` See below for more details

### onSubmit Props

| Prop                   | Type       | Description         |
|------------------------|------------|---------------------|
| **`hasError`**         | _Boolean_  | Indicates if a validation error was found, offered as a convenience so you don't have to inspect `errors`
| **`errors`**           | _Object_   | An object of any found errors. Each key will match the name of the offending field. The value will be the error.
| **`data`**             | _Object_   | The form data! Each key is a name of a field, the value is the value given by the user.
| **`done`**             | _Function_ | A function you can call to reset the form state. It has the signature `(errors = {}, values)`. You can pass in the existing errors, so they don't get reset. If `values` is null, then the `initialData` will be set again. If you wish to clear all values, pass an empty object: `done({}, {})`
