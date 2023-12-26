import { Metadata } from "next"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"

import DiscipleAddButton from "../../components/disciple-add-button"
import DiscipleDeleteDialog from "../../components/disciple-delete-dialog"
import DiscipleRowActions from "../../components/disciple-row-actions"
import { getDiscipleById, getDisciplesByLeader } from "../../service/disciples"

export const generateMetadata = async ({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> => {
  const disciple = await getDiscipleById(params.id)

  return {
    title: `Disciples of ${disciple?.name}`,
  }
}

async function DiscipleListOfPrimary({ params }: { params: { id: string } }) {
  const disciples = await getDisciplesByLeader(params.id)

  return (
    <div className="rounded-lg border dark:bg-muted">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div>
          <h2 className="text-lg font-bold tracking-tight">Disciples</h2>
          <p className="text-sm text-muted-foreground">
            Showing {disciples.length} disciples.
          </p>
        </div>
        <DiscipleAddButton leaderId={params.id} />
      </div>
      <ul className="divide-y">
        {disciples.map((disciple) => (
          <li key={disciple.id}>
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <Link
                  href={`/disciples/${disciple.id}`}
                  className="inline-block hover:underline"
                >
                  <span className="flex items-center gap-2 whitespace-nowrap text-sm">
                    {disciple.name}
                  </span>
                </Link>
                {!disciple.isActive && (
                  <Badge variant="destructive" className="ml-2">
                    Inactive
                  </Badge>
                )}
              </div>
              <DiscipleRowActions disciple={disciple} />
            </div>
          </li>
        ))}
      </ul>
      <DiscipleDeleteDialog />
    </div>
  )
}

export default DiscipleListOfPrimary
