import { Metadata } from "next"

import PageTitle from "@/components/page-title"

export const metadata: Metadata = {
  title: "Process - Encounter",
}

function EncounterPage() {
  return (
    <div className="relative flex flex-col gap-4 overflow-hidden p-4">
      <div className="flex items-start justify-between gap-4">
        <PageTitle
          title="Encounter"
          subtitle="List of Encounter God Retreat Batches."
        />
      </div>
    </div>
  )
}

export default EncounterPage
