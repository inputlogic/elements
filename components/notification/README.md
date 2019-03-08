# Notification

Displays a notification message.

## Installation

`npm install --save @app-elements/notification`

## Usage

```javascript
import Notification, { showNotification } from '@app-elements/notification'

// Place in your root App component. Should only be rendered once in your DOM tree.
<Notification />

// To show a notification
showNotification({ message: 'PIRATES!' })
```

## `showNotification` options

| Prop                   | Type       | Default       | Description         |
|------------------------|------------|---------------|---------------------|
| **`message`**          | _String_   | _None_        | The text to display in the notification
| **`type`**             | _Enum_     | `'error'`     | The class to use for the notication style. One of: `[ 'error', 'warning', 'success' ]`
| **`length`**           | _Number_   | `3000`        | Time to keep the message displayed in milliseconds
