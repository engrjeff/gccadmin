import { AreaChart } from "@tremor/react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { getAnnualCellReports } from "../service"

async function AnnualCellReports() {
  const annualCellReports = await getAnnualCellReports()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Annual Cell Reports</CardTitle>
        <CardDescription>Cell Report Trend for 2023</CardDescription>
      </CardHeader>
      <CardContent className="pl-0 lg:pl-0">
        <AreaChart
          data={annualCellReports.map((d) => ({
            ...d,
            "Monthly Cell Groups": d.monthlyCgCount,
          }))}
          index="month"
          categories={["Monthly Cell Groups"]}
          colors={["indigo"]}
        />
      </CardContent>
    </Card>
  )
}

export default AnnualCellReports
