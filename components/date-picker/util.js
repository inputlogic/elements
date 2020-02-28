export function buildCalendar (weekStartDay, date, chunk = true) {
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
  if (dayOfWeek !== getDayOfWeekIndex(weekStartDay)) {
    const startDay = getStartOfWeek(weekStartDay)(currentMonthFirstDay)
    const diff = differenceInCalendarDays(startDay)(currentMonthFirstDay)
    lpad = incrementingDays(diff, startDay)
  }

  const remainingNumberOfDays = MONTH_CELLS - (lpad.length + currentMonth.length)
  if (remainingNumberOfDays > 0) {
    // start with 1 day ahead of the last day of currentMonth, otherwise
    // you'll end up with `[..., Nov 30, Nov 30, ...]`
    rpad = incrementingDays(remainingNumberOfDays, addDays(1)(currentMonth[daysInMonth - 1]))
  }

  const days = lpad.concat(currentMonth, rpad)
  return chunk ? W.chunk(7, days) : days
}
