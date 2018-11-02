# Helmet

A very basic means of setting and updating document title and meta tags from your (P)React components.

## Installation

`npm install --save @app-elements/helmet`

## Usage

`Helmet` can be declared in your JSX many times. Each time, the result will be merged with the previous. It follows the order of your React tree, meaning the last (or "most nested") `Helmet` declared in your React tree will take precedence.

Say, in your root Component:

```javascript
import Helmet from '@app-elements/helmet'

<Helmet
  title='Welcome'
  titleTemplate='PWA Starter | %s'
  defaultTitle='Welcome'
/>
```

Then, in some nested child Component:

```javascript
<Helmet
  title='Nested Title'
/>
```

The resulting object representation would be:

```json
{
  "title": "Nested Title",
  "titleTemplate": "PWA Starter | %s",
  "defaultTitle": "Welcome"
}
```

The `document.title` will be updated each time a Helmet instance is rendered. However, the meta tags are only rendered once (and still give precedence to the last `Helmet` in the tree). This means the meta tags are set properly on initial load and when rendering on the server. So, when you share a link on social media, the correct OG tags or other meta tags will be used. But, the meta tags will not update after initial load. From what I can tell, this has no negative affect.


### Server-Side Rendering

You can see full working code in [PWA Starter](https://github.com/inputlogic/pwa-starter/blob/master/server/renderReact.js), but here are the key bits:

```javascript
import render from 'preact-render-to-string'

import Helmet, {rewind} from '@app-elements/helmet'

const head = render(<Helmet {...rewind()} />).slice(5, -6) // slice off `<head>`, `</head>` tags

// ...
app.get('*', (req, res) => {
  /// ...
  res.send(`
    <html lang="en">
      <head>
        <base href="/">
        <meta charset="utf-8">
        <link rel="stylesheet" href="./bundle.css" />
        ${head}
      </head>
      <body>
        <div class='main-app-container'>${html}</div>
        <script>window.__initial_store__ = ${JSON.stringify(state)};</script>
        <script src="./bundle.js"></script>
      </body>
    </html> 
  `) 
})
```

## Props

| Prop                   | Type        | Default       | Description         |
|------------------------|-------------|---------------|---------------------|
| **`title`**            | _String_    | _None_        | The title to set. Will be used inside the `titleTemplate` string.
| **`titleTemplate`**    | _String_    | `'%s'`        | Format your title strings. `%s` will be replaced with current title. Ex. `'%s | My Cool Site'`
| **`defaultTitle`**     | _String_    | _None_        | The default value to replace `%s` with in your `titleTemplate`. Ex. `'Home'`
| **`meta`**             | _Array_     | _None_        | An array of objects representing `<meta />` tags. Supports `name`, `property`, `content` attributes.
