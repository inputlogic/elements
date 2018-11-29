# Image

Renders an `<img />` only once it's in the viewport.

## Installation

`npm install --save @app-elements/image`

## Usage

```javascript
import Image from '@app-elements/image'

<Image
  srcs={[
    'http://www.placehold.it/200x150/eee/eee?text=Loading',
    'http://www.placehold.it/400x300/f44/fff?text=MediumRes',
    'http://www.placehold.it/800x600/44f/fff?text=HighRes'
  ]}
/>
```

## Props

| Prop              | Type        | Default  | Description         |
|-------------------|-------------|----------|---------------------|
| **`srcs`**        | _Array_     | _None_   | An array of image URLs.
