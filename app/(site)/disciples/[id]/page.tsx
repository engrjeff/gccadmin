import { notFound } from "next/navigation"

import BasicDetailsCard from "../components/basic-details-card"
import DiscipleAccountActions from "../components/disciple-account-actions"
import { getDiscipleById, getUserAccounts } from "../service/disciples"

async function DiscipleDetailPage({ params }: { params: { id: string } }) {
  const disciple = await getDiscipleById(params.id)
  const userAccounts = await getUserAccounts()

  if (!disciple) return notFound()

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="flex-1">
        <BasicDetailsCard disciple={disciple} />
      </div>
      <DiscipleAccountActions disciple={disciple} userAccounts={userAccounts} />
    </div>
  )
}

export default DiscipleDetailPage
