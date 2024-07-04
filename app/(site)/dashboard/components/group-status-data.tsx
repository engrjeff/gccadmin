"use client"

import { useChurchStatusData } from "@/hooks/stats-hooks"
import { Skeleton } from "@/components/ui/skeleton"

import CellStatusData from "./cell-status-data"
import ChurchStatusData from "./church-status-data"
import MemberTypeData from "./member-type-data"
import ProcessLevelData from "./process-level-data"

function GroupStatusData() {
  const churchStatus = useChurchStatusData()

  if (churchStatus.isLoading)
    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Skeleton className="h-[490px]" />
        <Skeleton className="h-[490px]" />
        <Skeleton className="h-[490px]" />
        <Skeleton className="h-[490px]" />
      </div>
    )

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <ChurchStatusData data={churchStatus.data?.data.churchData!} />
      <CellStatusData data={churchStatus.data?.data.cellData!} />
      <MemberTypeData data={churchStatus.data?.data.memberTypeData!} />
      <ProcessLevelData data={churchStatus.data?.data.processData!} />
    </div>
  )
}

export default GroupStatusData
