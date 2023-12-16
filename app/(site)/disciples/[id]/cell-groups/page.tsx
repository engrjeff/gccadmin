import { Badge } from "@tremor/react"
import { format } from "date-fns"

import { getCellgroupsAttendedByDisciple } from "../../service/disciples"

async function DiscipleAttendedCellGroupsPage({
  params,
}: {
  params: { id: string }
}) {
  const cellgroupsAttended = await getCellgroupsAttendedByDisciple(params.id)

  const count = cellgroupsAttended?.attended_cell_reports.length ?? 0

  return (
    <div className="rounded-lg border dark:bg-muted">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div>
          <h2 className="text-lg font-bold tracking-tight">
            Attended Cell Groups
          </h2>
          <p className="text-sm text-muted-foreground">
            Showing {count} {count > 1 ? "lessons" : "lesson"} attended.
          </p>
        </div>
      </div>
      {count === 0 ? (
        <div className="flex h-28 items-center justify-center px-4 py-3">
          <p className="text-muted-foreground">
            No attended cell group yet. Make sure that this disciple is
            attending a cell group.
          </p>
        </div>
      ) : (
        <ul className="divide-y">
          {cellgroupsAttended?.attended_cell_reports?.map((cg) => (
            <li key={cg.cell_report_id}>
              <div className="flex items-center justify-between px-4 py-3">
                <div>
                  <h3 className="flex items-center gap-2 whitespace-nowrap text-sm font-semibold">
                    {cg.cell_report.lessonId
                      ? cg.cell_report.lesson?.title
                      : cg.cell_report.lesson_name}
                    <span>
                      <Badge>Test</Badge>
                    </span>
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    Taken on {format(cg.cell_report.date, "MMM dd, yyyy")}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default DiscipleAttendedCellGroupsPage
