import { BarList, Bold, Flex, Text } from "@tremor/react"
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
  const cgCountByLeaderData = data.weeklyReports.cgCountByLeaderData

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
        <CardDescription className="text-3xl font-bold text-foreground">
          {totalCGDone}{" "}
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
      <CardContent>
        <Flex className="mt-4">
          <Text className="text-muted-foreground">
            <Bold>Leader</Bold>
          </Text>
          <Text className="text-muted-foreground">
            <Bold>No. of CGs Done</Bold>
          </Text>
        </Flex>
        <BarList
          color="sky"
          data={cgCountByLeaderData.map((d) => ({
            name: `${d.name} - (${d.uniqueDisciplesDuringCgCount} disciples)`,
            value: d.cgCount,
          }))}
          className="mt-2"
        />
      </CardContent>
    </Card>
  )
}

export default WeeklyCellReports
