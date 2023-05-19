import Link from "next/link"
import { format } from "date-fns"

import PageTitle from "@/components/page-title"

import { getDiscipleById } from "../../service/disciples"

async function DiscipleAttendedCellGroupsPage({
  params,
}: {
  params: { id: string }
}) {
  const disciple = await getDiscipleById(params.id)

  if (!disciple) return <p>Not found...</p>

  return (
    <div className="h-full space-y-6 overflow-y-auto px-6">
      <div className="flex items-center justify-between">
        <PageTitle
          title={`Cell Groups Attended by ${disciple.name}`}
          subtitle="List of cell groups attended"
        />
        <Link
          href={`/disciples/${params.id}`}
          className="underline hover:text-primary"
        >
          Back
        </Link>
      </div>
      <ul>
        <li className="mb-3">
          <div className="grid grid-cols-3">
            <h3 className="text-sm font-semibold uppercase text-muted-foreground">
              Topic
            </h3>
            <h3 className="text-sm font-semibold uppercase text-muted-foreground">
              Venue
            </h3>
            <p className="text-sm font-semibold uppercase text-muted-foreground">
              Date Attended
            </p>
          </div>
        </li>
        {disciple.attended_cell_reports.map(({ cell_report, assignedAt }) => (
          <li key={cell_report.id} className="border-b py-4">
            <div className="grid grid-cols-3">
              <h3>
                {cell_report.lesson_name
                  ? cell_report.lesson_name
                  : cell_report.lesson?.title}
              </h3>
              <p className="text-sm">{cell_report.venue}</p>
              <p className="text-sm">{format(assignedAt, "MMM dd, yyyy")}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default DiscipleAttendedCellGroupsPage
