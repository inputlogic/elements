# Carousel

Simple (P)React carousel with arrows and dot indicators.

## Installation

`npm install --save @app-elements/carousel`

## Usage

```
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

| Prop                   | Type       | Description         |
|------------------------|------------|---------------------|
| **`className`**        | _String_   | className given to each slide element. Default: `'carousel-slide'`
| **`wrapperClass`**     | _String_   | className given to top-level carousel div. Default: `''`
| **`noNav`**            | _Boolean_  | Set to `true` to skip rendering prev/next elements. Default: `false`
| **`withDots`**         | _Boolean_  | If `true`, renders indicator dots below slides. Default: `false`
| **`children`**         | _Array_    | Each child is one of the slides in the Carousel.
