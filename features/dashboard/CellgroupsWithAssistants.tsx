"use client"

import { useWeeklyCellGroups } from "@/hooks/use-weekly-cellgroups"
import { Skeleton } from "@/components/ui/skeleton"

const RADIUS = 41.5

function calcStrokeDashArrayValue(percent: number) {
  const C = 2 * Math.PI * RADIUS
  return `${(C * percent) / 100} ${C}`
}

export function CellgroupsWithAssistants() {
  const report = useWeeklyCellGroups()

  if (report.isLoading)
    return (
      <Skeleton className="h-[224px] animate-pulse rounded-lg bg-muted/30 p-4" />
    )

  const cellReports = report.data?.cellReports
    ?.map((d) => d.cell_reports)
    .flat()

  const withAssistants = cellReports?.filter((cg) => cg.assistant_id)

  const byPrimary = cellReports?.filter((cg) => !cg.assistant_id)

  const count = {
    withAssistants: withAssistants?.length ?? 0,
    byPrimary: byPrimary?.length ?? 0,
  }

  function calcPercent(input: number) {
    if (!cellReports?.length) return 0

    return (input / cellReports?.length) * 100
  }

  const strokeDashArray = calcStrokeDashArrayValue(
    calcPercent(count.withAssistants)
  )

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-muted/10 p-5">
      <p className="text-sm font-semibold">Cell Groups Handled</p>
      <div className="flex flex-nowrap items-center justify-between gap-y-4">
        <dd className="space-y-3">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="size-2.5 shrink-0 rounded-sm bg-blue-500 dark:bg-blue-500"
                aria-hidden="true"
              ></span>
              <span className="text-sm">With Assistant</span>
            </div>
            <span className="mt-1 block text-2xl font-semibold text-gray-900 dark:text-gray-50">
              {calcPercent(count.withAssistants).toFixed(1)}%
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className="size-2.5 shrink-0 rounded-sm bg-red-500 dark:bg-red-500"
                aria-hidden="true"
              ></span>
              <span className="text-sm text-gray-900 dark:text-gray-50">
                By Primary
              </span>
            </div>
            <span className="mt-1 block text-2xl font-semibold text-gray-900 dark:text-gray-50">
              {calcPercent(count.byPrimary).toFixed(1)}%
            </span>
          </div>
        </dd>
        <div
          className="relative"
          role="progressbar"
          aria-label="progress bar"
          aria-valuenow={calcPercent(count.withAssistants)}
          aria-valuemin={0}
          aria-valuemax={100}
          data-max="100"
          data-value={calcPercent(count.withAssistants)}
        >
          <svg
            width="90"
            height="90"
            viewBox="0 0 90 90"
            className="-rotate-90"
          >
            <circle
              r={RADIUS}
              cx="45"
              cy="45"
              stroke-width="7"
              fill="transparent"
              stroke=""
              stroke-linecap="round"
              className="stroke-gray-100 transition-colors ease-linear dark:stroke-gray-500/30"
            ></circle>
            <circle
              r={RADIUS}
              cx="45"
              cy="45"
              stroke-width="7"
              stroke-dasharray={strokeDashArray}
              stroke-dashoffset={0}
              fill="transparent"
              stroke=""
              stroke-linecap="round"
              className="transform-gpu stroke-blue-500 transition-all duration-300 ease-in-out dark:stroke-blue-500"
            ></circle>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center"></div>
        </div>
      </div>
    </div>
  )
}
