# useForm

Manage Preact, React, and React Native forms with a simple hook.

## Installation

`npm install --save @app-elements/use-form`

## Usage

```javascript
import { useForm } from '@app-elements/use-form'

const MyComponent = (props) => {
  const { clear, field, submit, isSubmitting } = useForm({
    action: 'auth/login',
    validations: {
      email: s => !s && 'Please provide your email address.',
      password: s => (!s || s.length < 6) && 'Password must be at least 6 characters'
    },
    onSuccess: ({ response }) => {
      console.log('onSuccess', response)
      clear(true)
    },
    onFailure: (errors) => console.log('onFailure', errors)
  })
  return (
    <div>
      <h1>useForm</h1>
      <form onSubmit={submit}>
        <input
          label='Email Address'
          placeholder='Your Email'
          required
          {...field('email')}
        />
        <input
          type='password'
          label='Password'
          placeholder='Your Password'
          required
          {...field('password')}
        />
        <button type='submit' className='btn' disabled={isSubmitting }>Login</button>
      </form>
    </div>
  )
}
```

## Props

| Prop                | Type       | Default              | Description         |
|---------------------|------------|----------------------|---------------------|
| **`action`**        | _String_   | _None_               | A URL to send form data to on submit.
| **`opts`**          | _Object_   | `{ method: 'POST' }` | [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Syntax) object to pass to fetch.
| **`initialData`**   | _Object_   | `{}`                 | Initial values for any fields.
| **`validations`**   | _Object_   | _None_               | Each key should match a field name, and the value is a function that accepts the field value and returns falsey or a string describing the validation error.
| **`preProcess`**    | _Function_ | `x => x`             | A function to process the form data before it's sent to the `action` URL.
| **`onSuccess`**     | _Function_ | _None_               | Function called when the form is submitted and validations pass. If `action` is set, called with `{ response }` from the server, otherwise called with `{ formData }`.
| **`onFailure`**     | _Function_ | _None_               | Function called when validations fail, or if `action` is set and the server response was unsuccessful. 

## Return Values

---
#### field

> field(fieldName: String, opts?: { handlerName = 'onChange', errorClass = 'error', hintProp = 'title'}): Object

Return props to assign to a form input:

```javascript
{
  name,
  value,
  [handlerName],
  [hintProp?],
  [className?]
}
```

Usage:

```javascript
<input
  label='Email Address'
  placeholder='Your Email'
  required
  {...field('email')}
/>
```

---
#### submit

> submit(ev?: SubmitEvent): _None_

Submits the form. Can also be called manually without an event.

```javascript
<form onSubmit={submit}>
```

---
#### clear

> clear(clearErrors = true): _None_

Clears the form data, defaulting to the `InitialData` provided. Optionally clears form errors as well.

```javascript
clear(true)
```

---
#### formData

> Object

The current form data represented as an object. Could be referenced to sync data
outside of the form.

---
#### isSubmitting

> Boolean

Boolean representing if the form is currently submitting. Can be used to display
a loading indicator, or disable the submit button.
