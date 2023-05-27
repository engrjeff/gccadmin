"use client"

import { BarList, Bold, Flex, Text } from "@tremor/react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface WeeklyCellReportsProps {
  totalCGDone: number
  cgCountByLeaderData: {
    id: string
    name: string
    cgCount: number
    uniqueDisciplesDuringCgCount: number
  }[]
}

function WeeklyCellReports({
  totalCGDone,
  cgCountByLeaderData,
}: WeeklyCellReportsProps) {
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
          color="indigo"
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
