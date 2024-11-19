"use client"

import { usePrimaryLeaders } from "@/hooks/use-primary-leaders"

import { ColumnFilter } from "./ColumnFilter"

export function LeaderFilter() {
  const leaders = usePrimaryLeaders(true)

  if (leaders.isLoading)
    return (
      <div className="h-[30px] animate-pulse rounded-md border bg-gray-800 px-3"></div>
    )

  return (
    <ColumnFilter
      title="Leader"
      filterKey="leaderId"
      options={leaders.data?.map((i) => ({ label: i.name, value: i.id })) ?? []}
    />
  )
}
