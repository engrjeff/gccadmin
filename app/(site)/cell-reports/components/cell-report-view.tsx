"use client"

import Link from "next/link"
import { Disciple } from "@prisma/client"
import { format } from "date-fns"

import { cn, formatTime } from "@/lib/utils"
import { useSelectedCellReport } from "@/hooks/use-selected-cell-report"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

const cellStatusColorMap: Record<Disciple["cell_status"], string> = {
  FIRST_TIMER: "text-emerald-500",
  SECOND_TIMER: "text-sky-500",
  THIRD_TIMER: "text-blue-500",
  REGULAR: "text-primary",
}

function CellReportView() {
  const { setCellReport, cellReport } = useSelectedCellReport()

  if (!cellReport) return null

  return (
    <Sheet
      open
      onOpenChange={(isOpen) => {
        if (isOpen === false) {
          setCellReport(null)
        }
      }}
    >
      <SheetContent onClick={(e) => e.stopPropagation()}>
        <SheetHeader>
          <SheetTitle>
            {cellReport.lessonId
              ? cellReport.lesson?.title
              : cellReport.lesson_name}
          </SheetTitle>
          <Badge variant="secondary" className="w-min rounded capitalize">
            {cellReport.type.toLowerCase()}
          </Badge>
          <SheetDescription>
            Led by:{" "}
            <Link
              href={`/disciples/${
                cellReport.assistant_id
                  ? cellReport.assistant_id
                  : cellReport.leader.name
              }`}
              className="underline hover:text-white hover:no-underline"
            >
              {cellReport.assistant
                ? cellReport.assistant.disciple.name
                : cellReport.leader.name}
            </Link>
          </SheetDescription>
          {cellReport.assistant_id ? (
            <SheetDescription>Under: {cellReport.leader.name}</SheetDescription>
          ) : null}
        </SheetHeader>
        <div className="divide-y">
          <div className="py-4">
            <p className="text-sm font-semibold text-muted-foreground">Venue</p>
            <p className="text-sm">{cellReport.venue}</p>
          </div>
          <div className="py-4">
            <p className="text-sm font-semibold text-muted-foreground">
              Date and Time
            </p>
            <p className="text-sm">
              {format(cellReport.date, "MMM dd, yyyy")},{" "}
              {formatTime(cellReport.time)}
            </p>
          </div>
          <div className="py-4">
            <p className="text-sm font-semibold text-muted-foreground">
              Lesson
            </p>
            <p className="text-sm">
              {cellReport.lessonId
                ? cellReport.lesson?.title
                : cellReport.lesson_name}
            </p>
            <ul className="flex flex-wrap items-center gap-1">
              {[
                cellReport.lesson?.scripture_references,
                cellReport.scripture_references,
              ]
                .flat()
                .filter(Boolean)
                .map((sr, index) => (
                  <li key={`scripture-ref-${index + 1}`}>
                    <Badge variant="secondary" className="rounded">
                      {sr}
                    </Badge>
                  </li>
                ))}
            </ul>
          </div>
          <div className="py-4">
            <p className="mb-2 text-sm font-semibold text-muted-foreground">
              Attendees ({cellReport.attendees.length})
            </p>
            <ul className="max-h-[400px] space-y-2 overflow-y-auto pb-4">
              {cellReport.attendees.map((attendee) => (
                <li key={attendee.disciple_id}>
                  {
                    <Link
                      href={`/disciples/${attendee.disciple_id}`}
                      className={cn(
                        buttonVariants({ variant: "secondary" }),
                        "w-full justify-between"
                      )}
                    >
                      <span className="text-sm">{attendee.disciple.name}</span>
                      <Badge variant="outline" className="capitalize">
                        <span
                          className={cn(
                            "mr-2 scale-150",
                            cellStatusColorMap[attendee.disciple.cell_status]
                          )}
                        >
                          &#x2022;
                        </span>
                        {attendee.disciple.cell_status
                          .split("_")
                          .join(" ")
                          .toLowerCase()}
                      </Badge>
                    </Link>
                  }
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default CellReportView
