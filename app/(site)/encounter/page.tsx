import { Suspense } from "react"
import { Metadata } from "next"
import { EncounterAddBatchModal } from "@/features/encounter/EncounterAddBatchModal"
import { EncounterBatchActiveFilter } from "@/features/encounter/EncounterBatchActiveFilter"
import { EncounterBatchListing } from "@/features/encounter/EncounterBatchListing"
import { EncounterBatchSelect } from "@/features/encounter/EncounterBatchSelect"

import PageLoadingSpinner from "@/components/page-loading-spinner"
import PageTitle from "@/components/page-title"

export const metadata: Metadata = {
  title: "Process - Encounter",
}

interface EncounterPageProps {
  searchParams: {
    batchId: string | undefined
    memberStatus: "active" | "inactive" | undefined
  }
}

function EncounterPage({ searchParams }: EncounterPageProps) {
  return (
    <div className="relative flex flex-col gap-3 overflow-hidden p-4">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row">
        <PageTitle
          title="Encounter"
          subtitle="List of Encounter God Retreat Batches."
        />
        <div className="grid w-full grid-cols-1 gap-3 sm:flex sm:flex-row sm:items-start md:w-auto">
          <EncounterBatchActiveFilter />
          <EncounterBatchSelect />
          <EncounterAddBatchModal />
        </div>
      </div>

      <Suspense
        key={JSON.stringify(searchParams)}
        fallback={
          <div className="relative min-h-[300px] flex-1">
            <PageLoadingSpinner />
          </div>
        }
      >
        <EncounterBatchListing {...searchParams} />
      </Suspense>
    </div>
  )
}

export default EncounterPage
