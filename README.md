InputLogic Elements
===================

| Component                                             | Description                                                |
| ----------------------------------------------------- | ---------------------------------------------------------- |
| [Avatar](components/avatar)                           | Display avatar image. Falls back to initial.
| [Carousel](components/carousel)                       | Simple carousel with arrows and dot indicators. 
| [DatePicker](components/date-picker)                  | Simple calendar-style date-picker.     
| [Dropdown](components/dropdown)                       | Simple dropdown menus.  
| [Helmet](components/helmet)                           | Basic Component to set title and meta tags in your HTML.
| [Image](components/image)                             | Renders an image from an array of src's, assuming the first is low resolution, and the last is high resolution.
| [Interval](components/interval)                       | Call some function on an interval during the lifecycle of a component
| [LazyLoad](components/lazy-load)                      | Won't render children until it's in viewport.
| [Level](components/level)                             | Position all children on a level row.
| [LoadingIndicator](components/loading-indicator)      | Show a three dots loading indicator.
| [Modal](components/modal)                             | Display modals from anywhere in your component tree.
| [Notification](components/notification)               | Displays a notification message.
| [Pagination](components/pagination)                   | Display pagination links for a url that follows [DRF](https://www.django-rest-framework.org/) format.
| [Router](components/router)                           | The best router. 😅
| [Tooltip](components/tooltip)                         | Simple tooltips. 

| Hook                                                  | Description                                                |
| ----------------------------------------------------- | ---------------------------------------------------------- |
| [useActions](components/use-actions)                  | Define actions and add their reducer to your global store from a Component.
| [useMappedState](components/use-mapped-state)         | Map part of global state to a Component and keep it in sync.
| [useRequest](components/use-request)                  | Connect a Component to the result of an API request.
| [useForm](components/use-form)                        | Take the pain out of forms!
| [useSuccessiveTaps](components/use-successive-taps)   | A hook that fires a callback only after `n` taps or clicks.
| [useVariantState](components/use-variant-state)       | A hook for defining strict state descriptors and transitions.

- [~~connect~~](components/connect) **deprecated**
- [~~withRequest~~](components/with-request) **deprecated**
- [~~withState~~](components/with-state) **deprecated**
- [~~ListResource~~](components/list-resource) **deprecated**
- [~Form~](components/form) **deprecated**

Making Changes
--------------

1. Clone the repo
2. `npm install`
3. `npm run bootstrap`

Adding a New Package
--------------------

1. Copy the `_package-template` folder
2. Rename it, like `MyComponent`, and move into `/components` folder
3. Update the `name` field to match: `"@app-elements/<my-component>"`
4. Add your code to the `index.js` file and add any other files you need
5. From the root of the project run: `npm run bootstrap`

Publishing Changes
------------------

1. `npm run changed` to see what would be published
2. `npm run publish`

More details may be needed...
