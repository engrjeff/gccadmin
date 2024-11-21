import { Suspense } from "react"
import { Metadata } from "next"
import { CellReportAddModal } from "@/features/cell-reports/CellReportAddModal"
import { CellReportFilters } from "@/features/cell-reports/CellReportFilters"
import { CellReportListing } from "@/features/cell-reports/CellReportListing"

export const metadata: Metadata = {
  title: "Cell Reports",
}

interface PageProps {
  searchParams: { from?: string; to?: string }
}

function CellReportsPage() {
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

      <Suspense>
        <CellReportListing />
      </Suspense>
    </div>
  )
}

export default CellReportsPage
