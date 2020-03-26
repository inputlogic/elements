# DatePicker

Calender style date-picker and date-range-picker.

## Installation

`npm install --save @app-elements/date-picker`

## Usage

```javascript
import { DatePicker } from '@app-elements/date-picker'

// DatePicker expects it's state to be controlled by a parent Component.
// This will often mean we set and get the value of the DatePicker in our
// global state, but for this example, we will handle the state in the
// parent Component.

function StatefulComponent () {
  const [date, setDate] = useState()
  
  return (
    <DatePicker
      selectedDate={date}
      {/* Storing Dates is dangerous as they are mutable, and more troublesome
          when used for memoization or shallow compares. */}
      onChange={day => setDate(day.getTime())}
    />
  )
}
```

`DateRangePicker` is just slightly different:

```javascript
import { DateRangePicker } from '@app-elements/date-picker'

function StatefulComponent () {
  const [start, setStart] = useState()
  const [end, setEnd] = useState()
  
  const onDateRange = ({ startDate, endDate }) => {
    if (startDate != null) {
      setStart(startDate.getTime())
    } else if (endDate != null) {
      setEnd(endDate.getTime())
    } else if (startDate == null && endDate == null) {
      // If the user taps the existing startDate again, we
      // clear the selections.
      setStart(null)
      setEnd(null)
    }
  }
  
  return (
    <DateRangePicker
      startDate={start}
      endDate={end}
      onChange={onDateRange}
    />
  )
}
```

Sometimes you'll want full control over the layout and style of the DatePicker. If that's the case, just pass in your custom component as a child of DatePicker or DateRangePicker.

```javascript
const MyCustomDateRangePicker = (props) =>
  <DateRangePicker {...props} />
    {({month, monthString, year, onClickPreviousMonth, onClickNextMonth, dayHeaders, calendar, classNamesForDay, onClickDay}) => 
      <div>
        {/* See `date-picker.js` for an example of what goes inside `div` */}
      </div>
    )}
  </DateRangePicker>
```

## Props

### DatePicker

| Prop                   | Type       | Default       | Description         |
|------------------------|------------|---------------|---------------------|
| **`weekStartDay`**     | _Number_   | `0`           | Day of the week to start on, `0` being Sunday. [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getDay)
| **`selectedDate`**     | _Number_   | _None_        | The selected Date in ms, use `.getTime()` or `.valueOf()`. [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTime)
| **`onChange`**         | _Function_ | _None_        | Callback when user selects a day. Will be given a Date.


### DateRangePicker

| Prop                   | Type       | Default       | Description         |
|------------------------|------------|---------------|---------------------|
| **`weekStartDay`**     | _Number_   | `0`           | Day of the week to start on, `0` being Sunday. [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getDay)
| **`startDate`**        | _Number_   | _None_        | The selected start Date in ms, use `.getTime()` or `.valueOf()`. [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTime)
| **`endDate`**          | _Number_   | _None_        | The selected end Date in ms, use `.getTime()` or `.valueOf()`. [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTime)
| **`onChange`**         | _Function_ | _None_        | Callback when user selects a day. Will be given an object that may contain `startDate` and/or `endDate`.
