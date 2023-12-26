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
      <div className="mb-4 flex justify-between">
        <PageTitle
          title="Cell Reports"
          subtitle="Manage your cell reports here"
        />
        <CellReportAddButton />
      </div>
      <CellReportListing searchParams={searchParams} />
      <CellReportView />
    </>
  )
}

export default CellReportsPage
