# useVariantState

A hook for defining strict state descriptors and transitions. It's based on [Variant Type](https://github.com/staydecent/variant-type) and inspired by Finite State Machines. 

## Installation

`npm install --save @app-elements/use-variant-state`

## Usage

```javascript
import { useState } from 'react'
import { useVariantState } from '@app-elements/use-variant-state'

const SignupForm = (props) => {
  // We're holding the user inputs in these local state references
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()

  // Let's define out variant state!
  const {
    checkState,
    transitionTo,
    SavingEmail,
    SavedEmail,
    Failed
  } = useVariantState({
    initial: 'Initial',
    states: {
      Initial: [],
      SavingEmail: [],
      SavedEmail: [],
      Failed: [String]
    },
    transitions: {
      Initial: ['SavingEmail'],
      SavingEmail: ['SavedEmail', 'Failed']
    },
    effects: {
      SavingEmail: () => {
        request({ endpoint: 'users/signup', method: 'post', data: { email } })
        promise
          .then(() => {
            transitionTo(SavedEmail)
          })
          .catch(err => {
            transitionTo(Failed(err.msg || 'Failed to signup'))
          })
      },
      SavedEmail: () => {
        // Do something after SignUp!
      },
      Failed: (reason) => {
        showErrorNotification(reason)
      }
    }
  })
}
```

## Props

| Prop                   | Type       | Default       | Description         |
|------------------------|------------|---------------|---------------------|
| **`initial`**          | _String_   | _None_        | Which state to initialize with
| **`states`**           | _Object_   | _None_        | An object to create your [Variant Type](https://github.com/staydecent/variant-type#readme)
| **`transitions`**      | _Object_   | _None_        | For each key of your Variant Type, define an array of other keys which are valid to transition to
| **`effects`**          | _Object_   | _None_        | Define side effects when a new state is transitioned to
