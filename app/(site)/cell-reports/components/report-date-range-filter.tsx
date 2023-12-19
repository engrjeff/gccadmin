"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { addDays, format, previousSunday } from "date-fns"
import { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import DateRangePicker from "@/components/ui/data-range-picker"

function ReportDateRangeFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const firstDay = previousSunday(new Date())

  const fromQuery = searchParams.get("from")
  const toQuery = searchParams.get("to")

  const [date, setDate] = React.useState<DateRange | undefined>(() => ({
    from: fromQuery ? new Date(fromQuery) : firstDay,
    to: toQuery ? new Date(toQuery) : addDays(firstDay, 6),
  }))

  function filterByDateRange() {
    const sp = new URLSearchParams(searchParams)

    if (date?.from && date?.to) {
      sp.set("from", format(date.from, "yyyy-MM-dd"))
      sp.set("to", format(date.to, "yyyy-MM-dd"))

      router.push(pathname + "?" + sp.toString())
    }
  }

  return (
    <div className="flex gap-3">
      <DateRangePicker
        dateRange={date}
        onDateRangeChange={(daterange) => {
          setDate({
            from: new Date(daterange?.from?.toDateString()!),
            to: new Date(daterange?.to?.toDateString()!),
          })
        }}
      />
      <Button
        className="h-8"
        variant="secondary"
        size="sm"
        onClick={filterByDateRange}
      >
        Go
      </Button>
    </div>
  )
}

export default ReportDateRangeFilter
