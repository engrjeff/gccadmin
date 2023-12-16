import PageTitle from "@/components/page-title"

import CellReportAddButton from "./components/cell-report-add-button"
import CellReportListing from "./components/cell-report-listing"

interface PageProps {
  searchParams: { from?: string; to?: string }
}

function CellReportsPage({ searchParams }: PageProps) {
  return (
    <>
      <div className="mb-4 flex justify-between">
        <PageTitle
          title="Cell Reports"
          subtitle="Manage your cell reports here"
        />
        <CellReportAddButton />
      </div>
      <CellReportListing searchParams={searchParams} />
    </>
  )
}

export default CellReportsPage
