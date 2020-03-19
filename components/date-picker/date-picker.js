import { useState } from 'react'

import { buildCalendar, monthNames, addMonths, subMonths } from './util'

import './date-picker.less'

const dayStrings = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export function DatePicker ({ weekStartDay = 0, selectedDate, onChange }) {
  if (selectedDate != null && typeof selectedDate !== 'number') {
    console.error('DatePicker only accepts a timestamp for selectedDate!')
    return null
  }
  const [date, setDate] = useState(new Date())

  const calendar = buildCalendar(weekStartDay, date)
  const dayHeaders = weekStartDay === 0
    ? dayStrings.slice(0)
    : dayStrings.slice(weekStartDay).concat(dayStrings.slice(0, weekStartDay))

  const isCurrentMonth = d => d.getMonth() === date.getMonth()
  const isToday = d =>
    d.getMonth() === (new Date()).getMonth() && d.getDate() === (new Date()).getDate()
  const isSelected = d => selectedDate != null && d.getTime() === selectedDate

  const clsNames = (day) => [
    'ae-date-picker-date',
    isToday(day) && 'ae-date-picker-today',
    !isCurrentMonth(day) && 'ae-date-picker-other',
    isSelected(day) && 'ae-date-picker-selected'
  ].filter(Boolean).join(' ')

  const handleNextMonth = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setDate(addMonths(1, date))
  }

  const handlePrevMonth = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setDate(subMonths(1, date))
  }

  const handleSelect = (day) => (event) => {
    event.preventDefault()
    onChange(day)
  }

  return (
    <div className='ae-date-picker'>
      <div className='ae-date-picker-level'>
        <h5>{monthNames[date.getMonth()]} <span>{date.getFullYear()}</span></h5>
        <div className='ae-date-picker-controls'>
          <button className='ae-month-nav ae-date-picker-prev' onClick={handlePrevMonth}>{'<'}</button>
          <button className='ae-month-nav ae-date-picker-next' onClick={handleNextMonth}>{'>'}</button>
        </div>
      </div>
      <div className='ae-date-picker-table-wrap'>
        <table>
          <tr>
            {dayHeaders.map(header => <th>{header}</th>)}
          </tr>
          {calendar.map((week) =>
            <tr key={week.toString()}>
              {week.map((day) =>
                <td key={day.toString()}>
                  <button onClick={handleSelect(day)} className={clsNames(day)}>
                    {day.getDate()}
                  </button>
                </td>
              )}
            </tr>
          )}
        </table>
      </div>
    </div>
  )
}
