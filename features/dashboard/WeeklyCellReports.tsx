"use client"

import { CellReport, CellType, Disciple } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { endOfWeek, format, startOfWeek } from "date-fns"

import { apiClient } from "@/lib/apiClient"
import { Skeleton } from "@/components/ui/skeleton"

interface DiscipleWithCellReports extends Disciple {
  cell_reports: CellReport[]
}

export function WeeklyCellReports() {
  const reportData = useQuery({
    queryKey: ["weekly-cellgroups"],
    queryFn: async () => {
      try {
        const response = await apiClient.get<DiscipleWithCellReports[]>(
          "/reports/weekly-cellgroups"
        )

        return response.data
      } catch (error) {
        return []
      }
    },
  })

  if (reportData.isLoading)
    return (
      <Skeleton className="h-[210px] animate-pulse rounded-lg bg-muted/30 p-4" />
    )

  const cellReports = reportData.data?.map((d) => d.cell_reports).flat()

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

  const now = new Date()

  const dateRange = {
    start: format(startOfWeek(now, { weekStartsOn: 1 }), "MMM dd"),
    end: format(endOfWeek(now, { weekStartsOn: 1 }), "MMM dd, yyyy"),
  }

  return (
    <div className="flex flex-col gap-3 border-b pb-6 sm:border-b-0">
      <div>
        <p className="text-sm font-semibold">Cell Groups By Network</p>
        <p className="text-xs text-muted-foreground">
          {dateRange.start} - {dateRange.end}
        </p>
      </div>
      <div className="space-y-4">
        <div className="flex items-baseline gap-2">
          <span className="text-xl text-gray-900 dark:text-gray-50">
            {cellReports?.length}
          </span>
          <span className="text-sm text-gray-500">cell groups this week</span>
        </div>
        <div className="flex w-full items-center rounded-full bg-muted/30 [&>*]:h-1.5">
          <div
            className="h-full rounded-full bg-indigo-500"
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
        <ul role="list" className="mt-5 space-y-2">
          <li className="flex items-center gap-2 text-xs">
            <span
              className="size-2.5 rounded-sm bg-indigo-500"
              aria-hidden="true"
            ></span>
            <span className="text-gray-900 dark:text-gray-50">
              Discipleship
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              ({count.discipleshipCell}{" "}
              {count.discipleshipCell > 1 ? "reports" : "report"} /{" "}
              {calcPercent(count.discipleshipCell)}%)
            </span>
          </li>
          <li className="flex items-center gap-2 text-xs">
            <span
              className="size-2.5 rounded-sm bg-rose-500"
              aria-hidden="true"
            ></span>
            <span className="text-gray-900 dark:text-gray-50">Open Cell</span>
            <span className="text-gray-600 dark:text-gray-400">
              ({count.openCell} {count.openCell > 1 ? "reports" : "report"} /{" "}
              {calcPercent(count.openCell)}%)
            </span>
          </li>
          <li className="flex items-center gap-2 text-xs">
            <span
              className="size-2.5 rounded-sm bg-yellow-500"
              aria-hidden="true"
            ></span>
            <span className="text-gray-900 dark:text-gray-50">
              Soul Winning
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              ({count.soulwinning}{" "}
              {count.soulwinning > 1 ? "reports" : "report"} /{" "}
              {calcPercent(count.soulwinning)}%)
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}
