# Avatar

Display avatar image. Falls back to initial.

## Installation

`npm install --save @app-elements/avatar`

## Usage

```javascript
import Avatar from '@app-elements/avatar'

<Avatar
  src='path to your image'
  fullName='John Smith'
 />
```

## Props

| Prop                   | Type       | Default       | Description         |
|------------------------|------------|---------------|---------------------|
| **`className`**        | _String_   | `''`          | className given to top-level avatar-wrap div.
| **`size`**             | _Number_   | `'100'`       | based on percent. sets relative size of avatar.
