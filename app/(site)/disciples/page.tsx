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
      <div className="flex justify-end px-4 lg:mb-4 lg:justify-between lg:px-6">
        <PageTitle title="Disciples" subtitle="Manage your disciples here" />
        <DiscipleAddButton />
      </div>
      <div className="flex-1 overflow-auto px-4 lg:px-6">
        <DisciplesListing active={searchParams?.active} />
      </div>
      <DiscipleDeleteDialog />
    </>
  )
}

export default DisciplesPage
