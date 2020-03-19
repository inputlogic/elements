import chunk from '@wasmuth/chunk'

const MONTH_CELLS = 42 // 7 * 6

export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

export function getDaysInMonth (date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

export function addMonths (amount, date) {
  const copy = new Date(date.getTime())
  const desiredMonth = copy.getMonth() + amount
  const dateWithDesiredMonth = new Date(0)
  dateWithDesiredMonth.setFullYear(copy.getFullYear(), desiredMonth, 1)
  dateWithDesiredMonth.setHours(0, 0, 0, 0)
  const daysInMonth = getDaysInMonth(dateWithDesiredMonth)
  // Set the last day of the new month
  // if the original date was the last day of the longer month
  copy.setMonth(desiredMonth, Math.min(daysInMonth, copy.getDate()))
  return copy
}

export function subMonths (amount, date) {
  return addMonths(-amount, date)
}

export function addDays (amount, date) {
  const copy = new Date(date.getTime())
  copy.setDate(copy.getDate() + amount)
  return copy
}

export function incrementingDays (length, date) {
  return Array
    .from({ length })
    .map((el, idx) => idx === 0 ? date : addDays(idx, date))
}

const getStartOfWeek = (weekStartDay, date) => {
  const copy = new Date(date.getTime())
  const day = copy.getDay()
  const diff = (day - weekStartDay + 7) % 7
  copy.setDate(copy.getDate() - diff)
  copy.setHours(0, 0, 0, 0)
  return copy
}

const differenceInCalendarDays = (startDate, endDate) => {
  const start = new Date(startDate.getTime())
  const end = new Date(endDate.getTime())
  start.setHours(0, 0, 0, 0)
  end.setHours(0, 0, 0, 0)
  return Math.ceil((start - end) / 1000 / 60 / 60 / 24)
}

export function buildCalendar (weekStartDay, date, chunkWeeks = true) {
  date.setDate(1) // Always start on the first of the month
  const daysInMonth = getDaysInMonth(date)
  const currentMonth = incrementingDays(daysInMonth, date)

  // We have the current month, but the calendar always has 42 cells
  // so we need to determine the days on either end of this month
  // to pad the array with.
  let lpad = []
  let rpad = []

  // Is the first day of the given date's month is the first day of the week
  // as defined by the user's `weekStartDay`
  const currentMonthFirstDay = currentMonth[0]
  const dayOfWeek = currentMonthFirstDay.getDay()
  if (dayOfWeek !== weekStartDay) {
    const startDay = getStartOfWeek(weekStartDay, currentMonthFirstDay)
    const diff = differenceInCalendarDays(currentMonthFirstDay, startDay)
    lpad = incrementingDays(diff, startDay)
  }

  const remainingNumberOfDays = MONTH_CELLS - (lpad.length + currentMonth.length)
  if (remainingNumberOfDays > 0) {
    // start with 1 day ahead of the last day of currentMonth, otherwise
    // you'll end up with `[..., Nov 30, Nov 30, ...]`
    rpad = incrementingDays(remainingNumberOfDays, addDays(1, currentMonth[daysInMonth - 1]))
  }

  const days = lpad.concat(currentMonth, rpad)
  return chunkWeeks ? chunk(7, days) : days
}
