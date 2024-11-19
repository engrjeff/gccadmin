"use client"

import { useEncounterBatchList } from "@/hooks/use-encounter-batch-list"

import { ColumnFilter } from "./ColumnFilter"

export function BatchFilter() {
  const batchList = useEncounterBatchList()

  if (batchList.isLoading)
    return (
      <div className="h-[30px] animate-pulse rounded-md border bg-gray-800 px-3"></div>
    )

  return (
    <ColumnFilter
      title="Batch"
      filterKey="batchId"
      options={
        batchList.data?.map((i) => ({ label: i.batchName, value: i.id })) ?? []
      }
    />
  )
}
