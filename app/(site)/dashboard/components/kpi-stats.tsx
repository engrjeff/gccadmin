"use client"

import { format } from "date-fns"

import { useKPIData } from "@/hooks/stats-hooks"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function KPIStats() {
  const kpiQuery = useKPIData()

  if (kpiQuery.isLoading)
    return (
      <Card className="border-transparent lg:border-border">
        <CardHeader className="px-0 lg:px-6">
          <CardTitle>Stats as of this week</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 px-0 md:grid-cols-2 lg:px-6 xl:grid-cols-4">
          <Skeleton className="h-[108px]" />
          <Skeleton className="h-[108px]" />
          <Skeleton className="h-[108px]" />
          <Skeleton className="h-[108px]" />
        </CardContent>
      </Card>
    )

  if (!kpiQuery.data && !kpiQuery.isLoading)
    return (
      <Card className="border-transparent lg:border-border">
        <CardHeader className="px-0 lg:px-6">
          <CardTitle>Stats as of this week</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[108px] flex-col items-center justify-center">
            <p className="text-center text-sm text-muted-foreground">
              No data to show
            </p>
          </div>
        </CardContent>
      </Card>
    )

  const kpi = kpiQuery.data?.data

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
              {kpi?.activeInChurch}
            </p>
            <CardDescription>
              Out of {kpi?.totalDisciples} disciples
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="border border-l-4 border-l-emerald-500 shadow-none">
          <CardHeader>
            <CardDescription>Active Cell Members</CardDescription>
            <p className="text-2xl font-semibold leading-none tracking-tight">
              {kpi?.activeInCell}
            </p>
            <CardDescription>
              Out of {kpi?.totalDisciples} disciples
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="border border-l-4 border-l-cyan-500 shadow-none">
          <CardHeader>
            <CardDescription>Disciples in Process</CardDescription>
            <p className="text-2xl font-semibold leading-none tracking-tight">
              {kpi?.disciplesInProcess}
            </p>
            <CardDescription>
              Out of {kpi?.totalDisciples} disciples
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="border border-l-4 border-l-blue-500 shadow-none">
          <CardHeader>
            <CardDescription>Newly Won Souls</CardDescription>
            <p className="text-2xl font-semibold leading-none tracking-tight">
              {kpi?.newlyWonSouls}
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
