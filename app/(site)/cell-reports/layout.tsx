import { type ReactNode } from "react"

import PageTitle from "@/components/page-title"

import { getDisciples, getPrimaryLeaders } from "../disciples/service/disciples"
import { getLessonSeries } from "../resources/service"
import CellReportFilters from "./components/cell-report-filters"
import CellReportForm from "./components/cell-report-form"
import CellReportListItem from "./components/cell-report-list-item"
import { getCellReports } from "./service"

async function CellReportsLayout({ children }: { children: ReactNode }) {
  const lessonSeriesData = getLessonSeries()
  const disciplesData = getDisciples()
  const primaryLeadersData = getPrimaryLeaders()
  const cellReportsData = getCellReports()

  const [lessonSeriesList, { disciples }, primaryLeaders, cellReports] =
    await Promise.all([
      lessonSeriesData,
      disciplesData,
      primaryLeadersData,
      cellReportsData,
    ])

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto px-6">
      <div className="flex items-center justify-between">
        <PageTitle title="Cell Reports" subtitle="List of cell group reports" />
        <CellReportForm
          lessonOptions={lessonSeriesList}
          discipleOptions={disciples}
          primaryLeaders={primaryLeaders}
        />
      </div>
      <div className="flex gap-6">
        <div className="flex-1 space-y-3">
          <CellReportFilters />
          <ul className="space-y-3">
            {cellReports.map((report) => (
              <li key={report.id}>
                <CellReportListItem report={report} />
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1 rounded-lg border p-6">{children}</div>
      </div>
    </div>
  )
}

export default CellReportsLayout
