import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import PageTitle from "@/components/page-title"

import DiscipleEditForm from "../../components/disciple-edit-form"
import { getDiscipleById, getPrimaryLeaders } from "../../service/disciples"

async function UpdateDisciplePage({ params }: { params: { id: string } }) {
  const leaders = await getPrimaryLeaders()

  const disciple = await getDiscipleById(params.id)

  if (!disciple) return notFound()

  return (
    <div className="max-h-full space-y-4 overflow-y-auto">
      <Link
        href="/disciples"
        className="inline-flex items-center gap-3 font-medium hover:underline"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="sr-only">Back to </span>
        <span>Disciples</span>
      </Link>
      <PageTitle
        title={`Update ${disciple.name}`}
        subtitle={`User ID: ${disciple.id}`}
      />
      <DiscipleEditForm disciple={disciple} leaderOptions={leaders} />
    </div>
  )
}

export default UpdateDisciplePage
