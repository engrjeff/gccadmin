"use client"

import { MoreVerticalIcon } from "lucide-react"

import { getInitials } from "@/lib/utils"
import { useWeeklyCellGroups } from "@/hooks/use-weekly-cellgroups"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"

import { DiscipleDetails } from "../disciples/DiscipleDetails"
import { DiscipleRecord } from "../disciples/schema"

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

  const assistantCGCountMap = new Map<
    string,
    { assistant: DiscipleRecord; cgCount: number }
  >()

  assistants?.forEach((a) => {
    if (assistantCGCountMap.has(a.id)) {
      const currentCount = assistantCGCountMap.get(a.id)?.cgCount ?? 0
      assistantCGCountMap.set(a.id, {
        assistant: a,
        cgCount: currentCount + 1,
      })
    } else {
      assistantCGCountMap.set(a.id, {
        assistant: a,
        cgCount: 1,
      })
    }
  })

  return (
    <div className="flex max-h-[224px] flex-col gap-3 overflow-y-auto rounded-lg border bg-muted/10 p-5">
      <div>
        <p className="text-sm font-semibold">Disciples With Cell Groups</p>
        <p className="text-xs text-muted-foreground">
          Showing Disciples who handled Cell Groups this week.
        </p>
      </div>

      <ul className="space-y-2">
        {Array.from(assistantCGCountMap)?.map(([key, assistant]) => (
          <li key={assistant.assistant.id}>
            <div className="flex items-center gap-2">
              <Avatar className="size-8">
                <AvatarFallback className="bg-indigo-500/20 text-xs font-semibold text-indigo-500">
                  {getInitials(assistant.assistant.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm">{assistant.assistant.name}</p>
                <p className="ml-auto text-xs text-muted-foreground">
                  {assistantCGCountMap.get(key)?.cgCount} cell{" "}
                  {assistantCGCountMap.get(key)?.cgCount! > 1
                    ? "groups"
                    : "group"}
                </p>
              </div>
              <AssistantDetails assistant={assistant.assistant} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function AssistantDetails({ assistant }: { assistant: DiscipleRecord }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="-mr-3 ml-auto rounded-full"
        >
          <MoreVerticalIcon className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="inset-y-2 right-2 flex h-auto w-[95%] flex-col gap-0 overflow-y-hidden rounded-lg border bg-background p-0 focus-visible:outline-none sm:max-w-lg"
      >
        <SheetHeader className="space-y-1 border-b p-4 text-left">
          <SheetTitle>Disciple Details</SheetTitle>
          <div className="flex items-center justify-between">
            <SheetDescription>
              Quick details for{" "}
              <span className="font-semibold">{assistant.name}</span>.
            </SheetDescription>
            <Badge variant={assistant.isActive ? "ACTIVE" : "INACTIVE"}>
              {assistant.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </SheetHeader>
        <DiscipleDetails disciple={assistant} />
      </SheetContent>
    </Sheet>
  )
}
