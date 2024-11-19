import { format } from "date-fns"

import { removeUnderscores } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

import { CellReportRecord } from "./types"

export function CellReportDetails({
  cellReport,
}: {
  cellReport: CellReportRecord
}) {
  return (
    <div className="divide-y">
      <div className="px-4 py-2 text-sm">
        <p>Leader</p>
        <p className="text-muted-foreground">{cellReport.leader.name}</p>
      </div>
      {cellReport.assistant_id ? (
        <div className="px-4 py-2 text-sm">
          <p>Assistant Leader</p>
          <p className="text-muted-foreground">
            {cellReport.assistant?.disciple?.name}
          </p>
        </div>
      ) : null}
      <div className="px-4 py-2 text-sm">
        <p>Venue</p>
        <p className="text-muted-foreground">{cellReport.venue}</p>
      </div>
      <div className="px-4 py-2 text-sm">
        <p>Date</p>
        <p className="text-muted-foreground">
          {format(cellReport.date, "MMMM dd, yyyy")} at {cellReport.time}
        </p>
      </div>
      <div className="px-4 py-2 text-sm">
        <p>Lesson</p>
        <p className="text-muted-foreground">
          {cellReport.lesson_name
            ? cellReport.lesson_name
            : cellReport.lesson?.title}
        </p>
      </div>
      <div className="space-y-2 px-4 py-2 text-sm">
        <p>Scripture References</p>
        <div className="flex flex-wrap gap-2">
          {cellReport.scripture_references.length
            ? cellReport.scripture_references.map((sc, i) => (
                <Badge key={`scripture-ref-${sc}-${i}`} variant="NONE">
                  {sc}
                </Badge>
              ))
            : cellReport.lesson?.scripture_references?.map((sc, i) => (
                <Badge key={`lesson-scripture-ref-${sc}-${i}`} variant="NONE">
                  {sc}
                </Badge>
              ))}
        </div>
      </div>

      <div className="px-4 py-2 text-sm">
        <p>Attendees</p>
        <ul>
          {cellReport.attendees
            .sort((a, b) =>
              a.disciple_id === cellReport.assistant?.disciple_id ? -1 : 1
            )
            .map((attendee, idx) => (
              <li key={`attendee-${attendee.disciple_id}`} className="py-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {idx + 1}
                  </span>
                  <p className="text-sm">{attendee.disciple.name}</p>
                  <div className="space-x-2 w-full md:w-auto ml-3 md:ml-auto">
                    <Badge variant={attendee.disciple.cell_status}>
                      Cell: {removeUnderscores(attendee.disciple.cell_status)}
                    </Badge>
                    <Badge variant={attendee.disciple.church_status}>
                      Church:{" "}
                      {removeUnderscores(attendee.disciple.church_status)}
                    </Badge>
                  </div>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  )
}
