import { Metadata } from "next"

import PageTitle from "@/components/page-title"

import CellReportAddButton from "./components/cell-report-add-button"
import CellReportListing from "./components/cell-report-listing"
import CellReportView from "./components/cell-report-view"

export const metadata: Metadata = {
  title: "Cell Reports",
}

interface PageProps {
  searchParams: { from?: string; to?: string }
}

function CellReportsPage({ searchParams }: PageProps) {
  return (
    <>
      <div className="mb-4 flex justify-between px-4 lg:px-6">
        <PageTitle
          title="Cell Reports"
          subtitle="Manage your cell reports here"
        />
        <CellReportAddButton />
      </div>
      <div className="flex-1 overflow-auto px-4 lg:px-6">
        <CellReportListing searchParams={searchParams} />
      </div>
      <CellReportView />
    </>
  )
}

export default CellReportsPage
