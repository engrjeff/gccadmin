"use client"

import { CellStatus } from "@prisma/client"

import { removeUnderscores } from "@/lib/utils"
import { useMemberStatistics } from "@/hooks/use-member-statistics"
import { Skeleton } from "@/components/ui/skeleton"

export function MemberStatisticsByCellStatus() {
  const members = useMemberStatistics<"cell_status", CellStatus>("cellStatus")

  if (members.isLoading)
    return (
      <Skeleton className="h-[314px] animate-pulse rounded-lg bg-muted/30 p-4" />
    )

  const total =
    members.data?.reduce((total, a) => total + a._count.cell_status, 0) ?? 100

  return (
    <div className="flex flex-col gap-4 border-b pb-6 sm:border-b-0">
      <p className="text-sm font-semibold">Members by Cell Status</p>
      <ul className="space-y-4">
        {members.data?.map((member) => (
          <li key={"stat-" + member.cell_status}>
            <p className="flex justify-between text-sm">
              <span className="font-medium capitalize text-gray-900 dark:text-gray-50">
                {removeUnderscores(member.cell_status)}
              </span>
              <span className="font-medium text-gray-900 dark:text-gray-50">
                {member._count.cell_status}
                <span className="font-normal text-gray-500">/{total}</span>
                <span className="pl-2">
                  ({((member._count.cell_status / total) * 100).toFixed(1)}%)
                </span>
              </span>
            </p>
            <div className="mt-2 flex w-full items-center [&>*]:h-1.5">
              <div
                className="relative flex h-2 w-full items-center rounded-full bg-indigo-100 dark:bg-indigo-500/30"
                aria-label="progress bar"
                aria-valuenow={(member._count.cell_status / total) * 100}
                aria-valuemax={100}
              >
                <div
                  className="h-full flex-col rounded-full bg-indigo-600 dark:bg-indigo-500"
                  style={{
                    width: `${(member._count.cell_status / total) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-auto text-sm text-muted-foreground">
        The majority of members are{" "}
        <span className="text-indigo-600">
          {removeUnderscores(members.data?.at(0)?.cell_status!)}
        </span>{" "}
        in cell group.
      </p>
    </div>
  )
}
