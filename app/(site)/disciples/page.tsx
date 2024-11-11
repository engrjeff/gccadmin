import { Suspense } from "react"
import { Metadata } from "next"
import { DiscipleActivityTabs } from "@/features/disciples/DiscipleActivityTabs"
import { DiscipleCreateFormModal } from "@/features/disciples/DiscipleCreateFormModal"
import { DiscipleFilters } from "@/features/disciples/DiscipleFilters"
import { DiscipleListing } from "@/features/disciples/DiscipleListing"
import { DisciplesQueryArgs } from "@/features/disciples/schema"

import PageLoadingSpinner from "@/components/page-loading-spinner"
import PageTitle from "@/components/page-title"

export const metadata: Metadata = {
  title: "Disciples",
}

function DisciplesPage({ searchParams }: { searchParams: DisciplesQueryArgs }) {
  return (
    <div className="relative flex flex-col gap-4 overflow-hidden p-4">
      <div className="flex items-center justify-between">
        <DiscipleActivityTabs />
        <DiscipleCreateFormModal />
      </div>
      <PageTitle
        title="Disciples"
        subtitle="View and manage your disciples here."
      />
      <DiscipleFilters />
      <Suspense
        key={JSON.stringify(searchParams)}
        fallback={
          <div className="relative flex-1">
            <PageLoadingSpinner />
          </div>
        }
      >
        <DiscipleListing searchParams={searchParams} />
      </Suspense>
    </div>
  )

  // return (
  //   <>
  //     <div className="flex justify-end px-4 lg:mb-4 lg:justify-between lg:px-6">
  //       <PageTitle title="Disciples" subtitle="Manage your disciples here" />
  //       <DiscipleAddButton />
  //     </div>
  //     <div className="flex-1 overflow-auto px-4 lg:px-6">
  //       <DisciplesListing active={searchParams?.active} />
  //     </div>
  //     <DiscipleDeleteDialog />
  //   </>
  // )
}

export default DisciplesPage
