"use client"

import { format } from "date-fns"
import { Loader2Icon } from "lucide-react"

import { useAttendedCellGroups } from "@/hooks/use-attended-cellgroups"
import { Badge } from "@/components/ui/badge"

export function AttendedCellGroups({ discipleId }: { discipleId: string }) {
  const attendedCellGroups = useAttendedCellGroups(discipleId)

  if (attendedCellGroups.isLoading)
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Loader2Icon size={32} className="animate-spin" />
        <p>Getting data...</p>
      </div>
    )

  const count = attendedCellGroups.data?.length

  if (!count)
    return (
      <div className="flex h-28 items-center justify-center px-4 py-3">
        <p className="w-2/3 text-center text-muted-foreground">
          No cell groups attended yet. Make sure that this disciple is in a cell
          group.
        </p>
      </div>
    )

  return (
    <ul className="divide-y">
      {attendedCellGroups.data?.map((cg, index) => (
        <li key={`attended-cellgroup-${cg.cell_report_id}-${index}`}>
          <div className="flex items-start gap-4 px-4 py-3">
            <span className="text-sm text-muted-foreground">{index + 1}</span>
            <div>
              <h3 className="flex items-center gap-2 whitespace-nowrap text-sm font-semibold">
                {cg.cell_report?.lesson_name
                  ? cg.cell_report.lesson_name
                  : cg.cell_report.lesson.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                Attended on {format(new Date(cg.assignedAt), "MMMM dd, yyyy")}
              </p>
              {cg.cell_report.assistant_id ? (
                <p className="text-sm text-muted-foreground">
                  Led by:{" "}
                  <span className="font-semibold text-white">
                    {cg.cell_report.assistant.disciple.name}
                  </span>
                </p>
              ) : null}
              <Badge className="ml-auto" variant={cg.cell_report.type}>
                Cell Type: {cg.cell_report.type}
              </Badge>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
