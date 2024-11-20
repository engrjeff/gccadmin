"use client"

import { CellType } from "@prisma/client"

import { useWeeklyCellGroups } from "@/hooks/use-weekly-cellgroups"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export function WeeklyCellReports() {
  const reports = useWeeklyCellGroups()

  if (reports.isLoading)
    return (
      <Skeleton className="h-[224px] animate-pulse rounded-lg bg-muted/30 p-4" />
    )

  const cellReports = reports.data?.cellReports
    ?.map((d) => d.cell_reports)
    .flat()

  const trend = reports.data?.trend

  const openCell = cellReports?.filter((cg) => cg.type === CellType.OPEN)

  const discipleshipCell = cellReports?.filter(
    (cg) => cg.type === CellType.DISCIPLESHIP
  )

  const soulwinning = cellReports?.filter(
    (cg) => cg.type === CellType.SOULWINNING
  )

  const count = {
    openCell: openCell?.length ?? 0,
    discipleshipCell: discipleshipCell?.length ?? 0,
    soulwinning: soulwinning?.length ?? 0,
  }

  function calcPercent(input: number) {
    if (!cellReports?.length) return 0

    return (input / cellReports?.length) * 100
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-muted/10 p-5">
      <div>
        <p className="text-sm font-semibold">
          Cell Groups This Week{" "}
          {trend ? (
            <Badge
              variant={trend.status === "increased" ? "ACTIVE" : "INACTIVE"}
              className="ml-2 px-1"
            >
              {trend?.status === "increased" ? "+" : "-"}
              {trend?.value.toFixed(1)}%
            </Badge>
          ) : null}
        </p>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-xl font-bold text-gray-900 dark:text-gray-50">
          {cellReports?.length}
        </span>
        <span className="text-sm text-gray-500">cell groups this week</span>
      </div>
      <div className="flex w-full items-center rounded-full bg-muted/30 [&>*]:h-1.5">
        <div
          className="h-full rounded-full bg-blue-500"
          style={{
            width: `${calcPercent(count.discipleshipCell)}%`,
          }}
        ></div>
        <div
          className="h-full rounded-full bg-rose-500"
          style={{
            width: `${calcPercent(count.openCell)}%`,
          }}
        ></div>

        <div
          className="h-full rounded-full bg-yellow-500"
          style={{
            width: `${calcPercent(count.soulwinning)}%`,
          }}
        ></div>
      </div>
      <ul role="list" className="mt-auto flex items-center justify-between">
        <li className="flex flex-col gap-2 text-xs">
          <span className="text-base font-bold">
            {calcPercent(count.discipleshipCell).toFixed(1)}%
          </span>
          <div className="flex items-center gap-2">
            <span
              className="size-2.5 rounded-sm bg-blue-500"
              aria-hidden="true"
            ></span>
            <span className="text-gray-900 dark:text-gray-50">
              Discipleship ({count.discipleshipCell})
            </span>
          </div>
        </li>
        <li className="flex flex-col gap-2 text-xs">
          <span className="text-base font-bold">
            {calcPercent(count.openCell).toFixed(1)}%
          </span>
          <div className="flex items-center gap-2">
            <span
              className="size-2.5 rounded-sm bg-rose-500"
              aria-hidden="true"
            ></span>
            <span className="text-gray-900 dark:text-gray-50">
              Open ({count.openCell})
            </span>
          </div>
        </li>
        <li className="flex flex-col gap-2 text-xs">
          <span className="text-base font-bold">
            {calcPercent(count.soulwinning).toFixed(1)}%
          </span>
          <div className="flex items-center gap-2">
            <span
              className="size-2.5 rounded-sm bg-yellow-500"
              aria-hidden="true"
            ></span>
            <span className="text-gray-900 dark:text-gray-50">
              Soul Winning ({count.soulwinning})
            </span>
          </div>
        </li>
      </ul>
    </div>
  )
}
