# Image

Renders an `<img />` only once it's in the viewport.

## Installation

`npm install --save @app-elements/image`

## Usage

```javascript
import Image from '@app-elements/image'

<Image
  src={`http://www.placehold.it/400x300/${hex}/f44?text=${hex}`}
  unloadedSrc={`http://www.placehold.it/400x300/eee/eee?text=Loading`}
  style='width: 100%'
/>
```

## Props

| Prop              | Type        | Default  | Description         |
|-------------------|-------------|----------|---------------------|
| **`src`**         | _String_    | _None_   | The url of the image.
| **`unloadedSrc`** | _String_    | _None_   | A url to a placeholder image. Should be of a tiny filesize.
