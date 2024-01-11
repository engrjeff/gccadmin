import { format } from "date-fns"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { getKPIData } from "../service"

async function KPIStats() {
  const kpi = await getKPIData()

  return (
    <Card className="border-transparent lg:border-border">
      <CardHeader className="px-0 lg:px-6">
        <CardTitle>Stats as of this week</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 px-0 md:grid-cols-2 lg:px-6 xl:grid-cols-4">
        <Card className="border border-l-4 border-l-amber-500 shadow-none">
          <CardHeader>
            <CardDescription>Active Church Members</CardDescription>
            <p className="text-2xl font-semibold leading-none tracking-tight">
              {kpi.activeInChurch}
            </p>
            <CardDescription>
              Out of {kpi.totalDisciples} disciples
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="border border-l-4 border-l-emerald-500 shadow-none">
          <CardHeader>
            <CardDescription>Active Cell Members</CardDescription>
            <p className="text-2xl font-semibold leading-none tracking-tight">
              {kpi.activeInCell}
            </p>
            <CardDescription>
              Out of {kpi.totalDisciples} disciples
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="border border-l-4 border-l-cyan-500 shadow-none">
          <CardHeader>
            <CardDescription>Disciples in Process</CardDescription>
            <p className="text-2xl font-semibold leading-none tracking-tight">
              {kpi.disciplesInProcess}
            </p>
            <CardDescription>
              Out of {kpi.totalDisciples} disciples
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="border border-l-4 border-l-blue-500 shadow-none">
          <CardHeader>
            <CardDescription>Newly Won Souls</CardDescription>
            <p className="text-2xl font-semibold leading-none tracking-tight">
              {kpi.newlyWonSouls}
            </p>
            <CardDescription>
              As of {format(new Date(), "MMM dd, YYY")}
            </CardDescription>
          </CardHeader>
        </Card>
      </CardContent>
    </Card>
  )
}

export default KPIStats
