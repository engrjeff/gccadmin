import { Suspense } from "react"
import { Metadata } from "next"
import { CellReportAddModal } from "@/features/cell-reports/CellReportAddModal"
import { CellReportFilters } from "@/features/cell-reports/CellReportFilters"
import { CellReportListing } from "@/features/cell-reports/CellReportListing"

import PageLoadingSpinner from "@/components/page-loading-spinner"

export const metadata: Metadata = {
  title: "Cell Reports",
}

interface PageProps {
  searchParams: { from?: string; to?: string }
}

function CellReportsPage({ searchParams }: PageProps) {
  return (
    <div className="relative flex flex-col gap-4 overflow-hidden p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="mb-1 text-lg font-bold tracking-tight">Cell Report</h2>
          <p className="block text-sm text-muted-foreground">
            View and manage cell reports.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <CellReportFilters />
        <CellReportAddModal />
      </div>

      <Suspense
        key={JSON.stringify(searchParams)}
        fallback={
          <div className="relative min-h-[300px] flex-1">
            <PageLoadingSpinner />
          </div>
        }
      >
        <CellReportListing searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

export default CellReportsPage
