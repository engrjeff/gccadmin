import { Metadata } from "next"
import { CellReport } from "@prisma/client"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

import {
  getCellgroupsAttendedByDisciple,
  getDiscipleById,
} from "../../service/disciples"

const typeColor: Record<CellReport["type"], string> = {
  SOULWINNING: "text-black bg-green-500",
  DISCIPLESHIP: "text-black bg-orange-500",
  OPEN: "text-black bg-sky-500",
}

export const generateMetadata = async ({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> => {
  const disciple = await getDiscipleById(params.id)

  return {
    title: `Cell Groups Attended by ${disciple?.name}`,
  }
}

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
                  </h3>
                  <Badge
                    className={cn("capitalize", typeColor[cg.cell_report.type])}
                  >
                    {cg.cell_report.type.split("_").join(" ").toLowerCase()}
                  </Badge>
                  <span className="mt-1 block text-sm text-muted-foreground">
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
