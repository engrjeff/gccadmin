import { endOfWeek, format, startOfWeek } from "date-fns"

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
