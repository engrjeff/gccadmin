"use client"

import { getInitials } from "@/lib/utils"
import { useWeeklyCellGroups } from "@/hooks/use-weekly-cellgroups"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

export function DisciplesWithCellgroups() {
  const reports = useWeeklyCellGroups()

  if (reports.isLoading)
    return (
      <Skeleton className="h-[224px] animate-pulse rounded-lg bg-muted/30 p-4" />
    )

  const assistants = reports.data?.cellReports
    ?.map((d) => d.cell_reports)
    .flat()
    .filter((d) => d.assistant_id)
    .map((a) => a.assistant.disciple)

  const assistantCGCountMap = new Map<string, number>()

  assistants?.forEach((a) => {
    if (assistantCGCountMap.has(a.id)) {
      const currentCount = assistantCGCountMap.get(a.id) ?? 0
      assistantCGCountMap.set(a.id, currentCount + 1)
    } else {
      assistantCGCountMap.set(a.id, 1)
    }
  })

  return (
    <div className="max-h-[224px] bg-muted/10 flex flex-col gap-3 overflow-y-auto rounded-lg border p-5">
      <div>
        <p className="text-sm font-semibold">Disciples With Cell Groups</p>
        <p className="text-xs text-muted-foreground">
          Showing Disciples who handled Cell Groups this week.
        </p>
      </div>

      <ul className="space-y-2">
        {assistants?.map((leader) => (
          <li key={leader.id}>
            <div className="flex items-center gap-2">
              <Avatar className="size-8">
                <AvatarFallback className="bg-indigo-500/20 text-xs font-semibold text-indigo-500">
                  {getInitials(leader.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm">{leader.name}</p>
                <p className="text-xs text-muted-foreground ml-auto">
                  {assistantCGCountMap.get(leader.id)} cell{" "}
                  {assistantCGCountMap.get(leader.id)! > 1 ? "groups" : "group"}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
