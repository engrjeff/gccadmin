"use client"

import Link from "next/link"
import { useSelectedLayoutSegment } from "next/navigation"
import {
  CellReport,
  CellReportAssistant,
  CellReportAttendees,
  Disciple,
  Lesson,
} from "@prisma/client"
import { format } from "date-fns"
import { useSession } from "next-auth/react"

import { cn } from "@/lib/utils"

interface Props {
  report: CellReport & {
    attendees: CellReportAttendees[]
    lesson: Lesson | null
    leader: Disciple
    assistant: CellReportAssistant | null
  }
}

function CellReportListItem({ report }: Props) {
  const session = useSession()
  const segment = useSelectedLayoutSegment()

  const isCurrent = report.id === segment

  const isAdmin = session.data?.user?.role === "ADMIN"

  return (
    <Link href={`/cell-reports/${report.id}`}>
      <div
        className={cn(
          "flex items-center justify-between rounded-lg border p-4 ring-2 ring-transparent hover:border-primary",
          { "ring-primary border-primary pointer-events-none": isCurrent }
        )}
      >
        <div>
          <h3 className="text-lg font-semibold tracking-tight">
            {report.lesson_name ? report.lesson_name : report.lesson?.title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {format(report.date, "MMMM dd, yyyy")} &mdash;
            {report.time}
          </p>
        </div>
        {isAdmin && (
          <span className="inline-block text-sm text-muted-foreground">
            {report.leader.name}
          </span>
        )}
      </div>
    </Link>
  )
}

export default CellReportListItem
