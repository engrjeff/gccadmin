import { addDays, format, previousSunday } from "date-fns"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import ReportDateRangeFilter from "../../cell-reports/components/report-date-range-filter"
import { getCellReportData } from "../service"
import WeeklyCellReportsTable from "./weekly-reports-table"

function getDateRangeThisWeek(from?: string, to?: string) {
  const now = new Date()

  const start = previousSunday(now)

  const firstDay = from
    ? format(new Date(from), "MMM dd")
    : format(start, "MMM dd")

  const lastDay = to
    ? format(new Date(to), "MMM dd, yyyy")
    : format(addDays(start, 6), "MMM dd, yyyy")

  return { firstDay, lastDay }
}

interface PageProps {
  searchParams: { from?: string; to?: string }
}

async function WeeklyCellReports({ searchParams }: PageProps) {
  const data = await getCellReportData({
    from: searchParams.from,
    to: searchParams.to,
  })

  const totalCGDone = data.weeklyReports.totalCGsDone
  const totalCGLastWeek = data.pastWeeklyReports.totalCGsDone

  const { firstDay, lastDay } = getDateRangeThisWeek(
    searchParams.from,
    searchParams.to
  )

  return (
    <Card>
      <CardHeader className="pb-0">
        <div className="flex flex-col gap-y-3 md:flex-row  md:items-center md:justify-between">
          <CardTitle>Weekly Cell Report</CardTitle>
          <ReportDateRangeFilter />
        </div>
        <CardDescription className="flex flex-col gap-2 text-3xl font-bold text-foreground lg:flex-col">
          <span>{totalCGDone}</span>
          <span className="text-sm font-normal text-muted-foreground">
            {totalCGDone === 0
              ? "No cell groups this week yet"
              : `cell groups from ${firstDay} to ${lastDay}`}
          </span>
        </CardDescription>
        <span className="text-xs font-normal text-muted-foreground">
          Last week was {totalCGLastWeek}
        </span>
      </CardHeader>
      <CardContent className="p-0 pt-6">
        <WeeklyCellReportsTable data={data} />
      </CardContent>
    </Card>
  )
}

export default WeeklyCellReports
