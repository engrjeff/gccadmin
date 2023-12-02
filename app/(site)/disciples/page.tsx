import { Metadata } from "next"

import PageTitle from "@/components/page-title"

import DiscipleAddButton from "./components/disciple-add-button"
import DisciplesListing from "./components/disciples-listing"

export const metadata: Metadata = {
  title: "Disciples",
}

function DisciplesPage() {
  return (
    <>
      <div className="mb-4 flex justify-between">
        <PageTitle title="Disciples" subtitle="Manage your disciples here" />
        <DiscipleAddButton />
      </div>
      <DisciplesListing />
    </>
  )
}

export default DisciplesPage
