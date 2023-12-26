import { Metadata } from "next"
import { format } from "date-fns"

import {
  getCellgroupsAttendedByDisciple,
  getDiscipleById,
} from "../../service/disciples"

export const generateMetadata = async ({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> => {
  const disciple = await getDiscipleById(params.id)

  return {
    title: `Lessons Taken by ${disciple?.name}`,
  }
}

async function DiscipleLessonsTakenPage({
  params,
}: {
  params: { id: string }
}) {
  const cellgroupsAttended = await getCellgroupsAttendedByDisciple(params.id)

  const cgToDisplay = cellgroupsAttended?.attended_cell_reports?.filter(
    (cg) => cg.cell_report.lessonId
  )

  const count = cgToDisplay?.length ?? 0

  return (
    <div className="rounded-lg border dark:bg-muted">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div>
          <h2 className="text-lg font-bold tracking-tight">Lessons Taken</h2>
          <p className="text-sm text-muted-foreground">
            Showing {count} {count > 1 ? "lessons" : "lesson"} from{" "}
            <a
              href="https://gcc-site.vercel.app/"
              target="_blank"
              className="font-semibold text-sky-500 hover:underline"
            >
              GCC Resources
            </a>
          </p>
        </div>
      </div>
      {count === 0 ? (
        <div className="flex h-28 items-center justify-center px-4 py-3">
          <p className="text-muted-foreground">
            No lessons taken yet. Make sure that this disciple is attending a
            cell group.
          </p>
        </div>
      ) : (
        <ul className="divide-y">
          {cgToDisplay?.map((cg) => (
            <li key={cg.cell_report_id}>
              <div className="flex items-center justify-between px-4 py-3">
                <div>
                  <h3 className="flex items-center gap-2 whitespace-nowrap text-sm font-semibold">
                    {cg.cell_report.lesson?.title}
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

export default DiscipleLessonsTakenPage
