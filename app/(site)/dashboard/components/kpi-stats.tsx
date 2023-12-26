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
    <Card>
      <CardHeader>
        <CardTitle>Stats as of this week</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-l-4 border-l-amber-500 bg-muted2 shadow-none">
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
        <Card className="border-l-4 border-emerald-500 bg-muted2 shadow-none">
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
        <Card className="border-l-4 border-cyan-500 bg-muted2 shadow-none">
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
        <Card className="border-l-4 border-blue-500 bg-muted2 shadow-none">
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
