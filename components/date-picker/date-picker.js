import { useState } from 'react'

import { buildCalendar, monthNames, addMonths, subMonths } from './util'

import './date-picker.less'

const dayStrings = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export function DatePicker ({ weekStartDay = 1, selectedDate = new Date(), onChange }) {
  const [date, setDate] = useState(new Date())

  const calendar = buildCalendar(weekStartDay, date)
  const dayHeaders = weekStartDay === 0
    ? dayStrings.slice(0)
    : dayStrings.slice(weekStartDay).concat(dayStrings.slice(0, weekStartDay))

  const isCurrentMonth = d => d.getMonth() === date.getMonth()
  const isToday = d =>
    date.getMonth() === (new Date()).getMonth() && d.getDate() === date.getDate()
  const isSelected = d => d === selectedDate

  const clsNames = (day) => [
    'date',
    isToday(day) && 'today',
    !isCurrentMonth(day) && 'other',
    isSelected(day) && 'selected'
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
      <div className='date-picker-level'>
        <h5>{monthNames[date.getMonth()]} <span>{date.getFullYear()}</span></h5>
        <div className='controls'>
          <button className='month-nav prev' onClick={handlePrevMonth}>{'<'}</button>
          <button className='month-nav next' onClick={handleNextMonth}>{'>'}</button>
        </div>
      </div>
      <div className='table-wrap'>
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
