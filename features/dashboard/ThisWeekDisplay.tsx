import {
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from "date-fns"

export function ThisWeekDisplay() {
  const now = new Date()

  const dateRange = {
    start: format(startOfWeek(now, { weekStartsOn: 1 }), "MMM dd"),
    end: format(endOfWeek(now, { weekStartsOn: 1 }), "MMM dd, yyyy"),
  }

  return (
    <p className="text-xs text-muted-foreground">
      {dateRange.start} - {dateRange.end}
    </p>
  )
}

export function ThisMonthDisplay() {
  const now = new Date()

  const dateRange = {
    start: format(startOfMonth(now), "MMM dd"),
    end: format(endOfMonth(now), "MMM dd, yyyy"),
  }

  return (
    <p className="text-xs text-muted-foreground">
      {dateRange.start} - {dateRange.end}
    </p>
  )
}
