import { Metadata } from "next"

import PageTitle from "@/components/page-title"

import DiscipleAddButton from "./components/disciple-add-button"
import DiscipleDeleteDialog from "./components/disciple-delete-dialog"
import DisciplesListing from "./components/disciples-listing"

export const metadata: Metadata = {
  title: "Disciples",
}

function DisciplesPage({ searchParams }: { searchParams: { active: string } }) {
  return (
    <>
      <div className="mb-4 flex justify-between">
        <PageTitle title="Disciples" subtitle="Manage your disciples here" />
        <DiscipleAddButton />
      </div>
      <DisciplesListing active={searchParams?.active} />
      <DiscipleDeleteDialog />
    </>
  )
}

export default DisciplesPage
