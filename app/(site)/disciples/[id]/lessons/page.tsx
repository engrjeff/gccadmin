import Link from "next/link"
import { format } from "date-fns"

import PageTitle from "@/components/page-title"

import { getDiscipleById } from "../../service/disciples"

async function DiscipleLessonsTakenPage({
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
          title={`Lessons Taken by ${disciple.name}`}
          subtitle="List of lessons that were already taken"
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
              Title
            </h3>
            <p className="text-sm font-semibold uppercase text-muted-foreground">
              Date Taken
            </p>
          </div>
        </li>
        {disciple.lessons_taken.map(({ lesson, assignedAt }) => (
          <li key={lesson.id} className="border-b py-4">
            <div className="grid grid-cols-3">
              <h3>{lesson.title}</h3>
              <p className="text-sm">{format(assignedAt, "MMM dd, yyyy")}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default DiscipleLessonsTakenPage
