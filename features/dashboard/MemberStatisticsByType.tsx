"use client"

import { MemberType } from "@prisma/client"

import { removeUnderscores } from "@/lib/utils"
import { useMemberStatistics } from "@/hooks/use-member-statistics"
import { Skeleton } from "@/components/ui/skeleton"

export function MemberStatisticsByType() {
  const members = useMemberStatistics<"member_type", MemberType>("memberType")

  if (members.isLoading)
    return (
      <Skeleton className="border rounded-lg p-4 h-[314px] animate-pulse bg-muted/30" />
    )

  const total =
    members.data?.reduce((total, a) => total + a._count.member_type, 0) ?? 100

  return (
    <div className="flex flex-col pb-6 border-b sm:border-b-0">
      <p className="text-sm font-semibold">Members by Type</p>
      <ul className="mt-4 space-y-4">
        {members.data?.map((member) => (
          <li key={"stat-" + member.member_type}>
            <p className="flex justify-between text-sm">
              <span className="font-medium text-gray-900 dark:text-gray-50 capitalize">
                {removeUnderscores(member.member_type)}
              </span>
              <span className="font-medium text-gray-900 dark:text-gray-50">
                {member._count.member_type}
                <span className="font-normal text-gray-500">/{total}</span>
                <span className="pl-2">
                  ({((member._count.member_type / total) * 100).toFixed(1)}%)
                </span>
              </span>
            </p>
            <div className="flex w-full items-center mt-2 [&amp;>*]:h-1.5">
              <div
                className="relative flex h-2 w-full items-center rounded-full bg-indigo-100 dark:bg-indigo-500/30"
                aria-label="progress bar"
                aria-valuenow={(member._count.member_type / total) * 100}
                aria-valuemax={100}
              >
                <div
                  className="h-full flex-col rounded-full bg-indigo-600 dark:bg-indigo-500"
                  style={{
                    width: `${(member._count.member_type / total) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
