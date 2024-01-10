"use client"

import * as React from "react"
import {
  addDays,
  format,
  getMonth,
  lastDayOfMonth,
  previousSunday,
  startOfMonth,
} from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"

export default function DateRangePicker({
  className,
  align = "start",
  dateRange,
  onDateRangeChange,
}: React.HTMLAttributes<HTMLDivElement> & {
  align?: "center" | "start" | "end"
  dateRange: DateRange | undefined
  onDateRangeChange: (dateRange: DateRange | undefined) => void
}) {
  const [selectedPreset, setSelectedPreset] =
    React.useState<string>("this-week")

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            size="sm"
            className={cn(
              "h-8 w-auto justify-start text-left font-normal",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} -{" "}
                  {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={align}>
          <div className="p-3">
            <Select
              onValueChange={(value) => {
                setSelectedPreset(value)

                if (value === "today") {
                  onDateRangeChange({ from: new Date(), to: new Date() })
                }

                if (value === "this-week") {
                  const firstDay = previousSunday(new Date())
                  const lastDay = addDays(firstDay, 6)

                  onDateRangeChange({ from: firstDay, to: lastDay })
                }

                if (value === "last-week") {
                  const firstDay = previousSunday(previousSunday(new Date()))
                  const lastDay = addDays(firstDay, 6)

                  onDateRangeChange({ from: firstDay, to: lastDay })
                }

                if (value === "last-month") {
                  const monthNow = getMonth(new Date())
                  const isJanuary = monthNow === 0 // january
                  const previousMonth = isJanuary ? 11 : monthNow - 1
                  const targetYear = isJanuary
                    ? new Date().getFullYear() - 1
                    : new Date().getFullYear()

                  const firstDay = startOfMonth(
                    new Date(targetYear, previousMonth)
                  )
                  const lastDay = lastDayOfMonth(
                    new Date(targetYear, previousMonth)
                  )

                  onDateRangeChange({ from: firstDay, to: lastDay })
                }
              }}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select preset" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="last-week">Last Week</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Calendar
            key={selectedPreset}
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={onDateRangeChange}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
