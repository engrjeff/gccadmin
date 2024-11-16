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
    <div className="relative flex flex-col gap-3 overflow-hidden p-4">
      <div className="flex flex-col items-start gap-3 md:flex-row md:justify-between">
        <PageTitle
          title="Disciples"
          subtitle="View and manage your disciples here."
        />
        <div className="flex w-full items-center justify-between gap-3 md:w-auto md:justify-start">
          <DiscipleActivityTabs />
          <DiscipleCreateFormModal />
        </div>
      </div>
      <DiscipleFilters />
      <Suspense
        key={JSON.stringify(searchParams)}
        fallback={
          <div className="relative min-h-[300px] flex-1">
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
