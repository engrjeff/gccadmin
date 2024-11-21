"use client"

import { useCellReports } from "@/hooks/use-cell-reports"
import PageLoadingSpinner from "@/components/page-loading-spinner"

import { CellReportPagination } from "./CellReportPagination"
import { CellReportTable } from "./CellReportTable"

export function CellReportListing() {
  const reports = useCellReports()

  if (reports.isLoading)
    return (
      <div className="relative min-h-[300px] flex-1">
        <PageLoadingSpinner />
      </div>
    )

  const cellReports = reports.data?.cellReports

  const pageInfo = reports.data?.pageInfo

  return (
    <>
      <CellReportTable cellReports={cellReports ?? []} />
      <CellReportPagination pageInfo={pageInfo!} />
    </>
  )
}
