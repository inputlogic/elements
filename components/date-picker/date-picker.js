import React, { useState } from 'react'

import { buildCalendar, monthNames, addMonths, subMonths } from './util'

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export function BaseDatePicker ({
  weekStartDay,
  date,
  classNamesForDay,
  dayOfWeekHeaders,
  onNextMonth,
  onPrevMonth,
  onSelect,
  children
}) {
  const calendar = buildCalendar(weekStartDay, date)
  const dayHeaders = weekStartDay === 0
    ? dayOfWeekHeaders.slice(0)
    : dayOfWeekHeaders.slice(weekStartDay).concat(dayOfWeekHeaders.slice(0, weekStartDay))

  const onClickNextMonth = (event) => {
    event.preventDefault()
    event.stopPropagation()
    onNextMonth()
  }

  const onClickPreviousMonth = (event) => {
    event.preventDefault()
    event.stopPropagation()
    onPrevMonth()
  }

  const onClickDay = (day) => (event) => {
    event.preventDefault()
    event.stopPropagation()
    onSelect(day)
  }

  if (children && typeof children === 'function') {
    return children({
      month: date.getMonth(),
      monthString: monthNames[date.getMonth()],
      year: date.getFullYear(),
      onClickPreviousMonth,
      onClickNextMonth,
      dayHeaders,
      calendar,
      classNamesForDay,
      onClickDay
    })
  }

  return (
    <div className='ae-date-picker'>
      <div className='ae-date-picker-level'>
        <button className='ae-month-nav ae-date-picker-prev' onClick={onClickPreviousMonth}>{'<'}</button>
        <h5>{monthNames[date.getMonth()]} <span>{date.getFullYear()}</span></h5>
        <button className='ae-month-nav ae-date-picker-next' onClick={onClickNextMonth}>{'>'}</button>
      </div>
      <div className='ae-date-picker-table-wrap'>
        <table>
          <tr>
            {dayHeaders.map((header, idx) => <th key={`${header}-${idx}`}>{header}</th>)}
          </tr>
          {calendar.map((week) =>
            <tr key={week.toString()}>
              {week.map((day) =>
                <td key={day.toString()}>
                  <button onClick={onClickDay(day)} className={classNamesForDay(day)}>
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

export function DatePicker ({ weekStartDay = 0, dayOfWeekHeaders = DAYS, selectedDate, onChange, children }) {
  if (selectedDate != null && typeof selectedDate !== 'number') {
    console.error('DatePicker only accepts a timestamp for selectedDate!')
    return null
  }

  const [date, setDate] = useState(new Date())

  const isCurrentMonth = d => d.getMonth() === date.getMonth()
  const isToday = d =>
    d.getMonth() === (new Date()).getMonth() && d.getDate() === (new Date()).getDate()
  const isSelected = d => selectedDate != null && d.getTime() === selectedDate

  const classNamesForDay = (day) => [
    'ae-date-picker-date',
    isToday(day) && 'ae-date-picker-today',
    !isCurrentMonth(day) && 'ae-date-picker-other',
    isSelected(day) && 'ae-date-picker-selected'
  ].filter(Boolean).join(' ')

  const onNextMonth = () => {
    setDate(addMonths(1, date))
  }

  const onPrevMonth = () => {
    setDate(subMonths(1, date))
  }

  const onSelect = (day) => {
    onChange(day)
  }

  return (
    <BaseDatePicker
      weekStartDay={weekStartDay}
      date={date}
      classNamesForDay={classNamesForDay}
      dayOfWeekHeaders={dayOfWeekHeaders}
      onNextMonth={onNextMonth}
      onPrevMonth={onPrevMonth}
      onSelect={onSelect}
      children={children}
    />
  )
}

export function DateRangePicker ({ weekStartDay = 0, dayOfWeekHeaders = DAYS, startDate, endDate, onChange, children }) {
  if (startDate != null && typeof startDate !== 'number') {
    console.error('DateRangePicker only accepts a timestamp for startDate!')
    return null
  }
  if (endDate != null && typeof endDate !== 'number') {
    console.error('DateRangePicker only accepts a timestamp for endDate!')
    return null
  }

  const [date, setDate] = useState(new Date())

  const isCurrentMonth = d => d.getMonth() === date.getMonth()
  const isToday = d =>
    d.getMonth() === (new Date()).getMonth() && d.getDate() === (new Date()).getDate()
  const isSelected = d => {
    const ts = d.getTime()
    if (startDate && endDate) {
      return ts >= startDate && ts <= endDate
    } else {
      return ts === startDate || ts === endDate
    }
  }

  const classNamesForDay = (day) => [
    'ae-date-picker-date',
    isToday(day) && 'ae-date-picker-today',
    !isCurrentMonth(day) && 'ae-date-picker-other',
    isSelected(day) && 'ae-date-picker-selected'
  ].filter(Boolean).join(' ')

  const onNextMonth = () => {
    setDate(addMonths(1, date))
  }

  const onPrevMonth = () => {
    setDate(subMonths(1, date))
  }

  const onSelect = (day) => {
    if (startDate == null) {
      onChange({ startDate: day })
    } else if (endDate == null) {
      onChange({ endDate: day })
    } else if (day < startDate) {
      onChange({ startDate: day })
    } else if (day > startDate) {
      onChange({ endDate: day })
    } else {
      onChange({ startDate: null, endDate: null })
    }
  }

  return (
    <BaseDatePicker
      weekStartDay={weekStartDay}
      date={date}
      classNamesForDay={classNamesForDay}
      dayOfWeekHeaders={dayOfWeekHeaders}
      onNextMonth={onNextMonth}
      onPrevMonth={onPrevMonth}
      onSelect={onSelect}
      children={children}
    />
  )
}
