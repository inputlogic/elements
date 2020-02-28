import { useState } from 'react'

import { buildCalendar, monthNames, nextMonth, prevMonth } from './util'

import './date-picker.less'

export function DatePicker ({ selectedDate, onChange }) {
  const [date, setDate] = useState(new Date())

  const calendar = buildCalendar('mon', date)

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
    setDate(nextMonth(date))
  }

  const handlePrevMonth = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setDate(prevMonth(date))
  }

  const handleSelect = (day) => (event) => {
    event.preventDefault()
    onChange(day)
  }

  return (
    <div className='date-picker'>
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
            <th>M</th>
            <th>T</th>
            <th>W</th>
            <th>T</th>
            <th>F</th>
            <th>S</th>
            <th>S</th>
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
