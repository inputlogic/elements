# Carousel

Simple (P)React carousel with arrows and dot indicators.

## Installation

`npm install --save @app-elements/carousel`

## Usage

```javascript
import Carousel from '@app-elements/carousel'

const items = ['fff', 'a7c', '09d', '411', '111']

<Carousel withDots>
  {items.map(hex => (
    <Image
      src={`http://www.placehold.it/400x300/${hex}/f44?text=${hex}`}
      unloadedSrc={`http://www.placehold.it/400x300/eee/eee?text=Loading`}
      style='width: 100%'
    />
  ))}
</Carousel>
```

## Props

| Prop                   | Type       | Default       | Description         |
|------------------------|------------|------------|---------------------|
| **`className`**        | _String_   | `'carousel-slide'` | className given to each slide element.
| **`wrapperClass`**     | _String_   | `''`               | className given to top-level carousel div.
| **`noNav`**            | _Boolean_  | `false`            | Set to `true` to skip rendering prev/next elements.
| **`withDots`**         | _Boolean_  | `false`            | If `true`, renders indicator dots below slides.
| **`active`**           | _Number_   | `0`                | The active slide, must be an index of one of the children.
| **`tolerance`**        | _Number_   | `100`              | Tolerance for detecting touch swipes.
| **`children`**         | _Array_    | _None_             | Each child is one of the slides in the Carousel.
