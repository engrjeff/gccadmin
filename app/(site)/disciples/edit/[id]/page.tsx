import { notFound } from "next/navigation"

import BackButton from "@/components/back-button"
import PageTitle from "@/components/page-title"

import DiscipleEditForm from "../../components/disciple-edit-form"
import { getDiscipleById, getPrimaryLeaders } from "../../service/disciples"

async function UpdateDisciplePage({ params }: { params: { id: string } }) {
  const leaders = await getPrimaryLeaders()

  const disciple = await getDiscipleById(params.id)

  if (!disciple) return notFound()

  return (
    <div className="max-h-full space-y-4 overflow-y-auto">
      <BackButton />
      <PageTitle
        title={`Update ${disciple.name}`}
        subtitle={`User ID: ${disciple.id}`}
      />
      <DiscipleEditForm disciple={disciple} leaderOptions={leaders} />
    </div>
  )
}

export default UpdateDisciplePage
