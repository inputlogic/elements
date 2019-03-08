# Tooltip

Shows a tooltip when hovered.

## Installation

`npm install --save @app-elements/tooltip`

## Usage

```javascript
import Tooltip from '@app-elements/tooltip'

<h1><Tooltip text='This is your tooltip'>Home</Tooltip></h1>
```

## Props

| Prop                   | Type       | Default       | Description                 |
|------------------------|------------|-----------------------|---------------------|
| **`className`**        | _String_   | `''`                  | className given to top-level tooltip div
| **`text`**             | _String_   | `'I am default text'` | Text to display in Tooltip
| **`length`**           | _Enum_     | `'medium'`            | Determines class to use to dictate width of tooltip. One of `[ 'small', 'medium', 'large', 'xlarge', 'fit' ]`
| **`up`**               | _Boolean_  | `false`               | Will be positioned above your wrapped nodes
| **`right`**            | _Boolean_  | `false`               | Will be positioned to the right of your wrapped nodes
| **`down`**             | _Boolean_  | `false`               | Will be positioned below your wrapped nodes
| **`left`**             | _Boolean_  | `false`               | Will be positioned to the left of your wrapped nodes
