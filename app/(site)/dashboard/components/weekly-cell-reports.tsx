import { BarList, Bold, Flex, Text } from "@tremor/react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { getCellReportData } from "../service"

async function WeeklyCellReports() {
  const data = await getCellReportData()

  const totalCGDone = data.weeklyReports.totalCGsDone
  const totalCGLastWeek = data.pastWeeklyReports.totalCGsDone
  const cgCountByLeaderData = data.weeklyReports.cgCountByLeaderData

  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle>Weekly Cell Report</CardTitle>
        <CardDescription className="text-3xl font-bold text-foreground">
          {totalCGDone}{" "}
          <span className="text-sm font-normal text-muted-foreground">
            cell groups this week
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
