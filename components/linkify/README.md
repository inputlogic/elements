# Linkify

Convert URLs found in a string to anchor elements.

## Installation

`npm install --save @app-elements/linkify`

## Usage

```javascript
import { Linkify } from '@app-elements/linkify'

<Linkify text='Hey check this out, http://inputlogic.ca cool eh?' />
```

## Props

| Prop              | Type       | Default  | Description         |
|-------------------|------------|----------|---------------------|
| **`text`**        | _String_   | `null`   | String to convert found URLs to anchors
| **`anchorProps`** | _Object_   | `{}`     | Props to pass down to each created anchor
