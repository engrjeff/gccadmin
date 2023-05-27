import PageTitle from "@/components/page-title"

import { getDisciples, getPrimaryLeaders } from "../disciples/service/disciples"
import { getLessonSeries } from "../resources/service"
import CellReportFilters from "./components/cell-report-filters"
import CellReportForm from "./components/cell-report-form"
import CellReportListItem from "./components/cell-report-list-item"
import { getCellReports, getWeeklyReports } from "./service"

async function CellReportsPage() {
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
    <div className="flex h-full flex-col gap-4 overflow-y-auto">
      <div className="flex items-center justify-between">
        <PageTitle title="Cell Reports" subtitle="List of cell group reports" />
        <CellReportForm
          lessonOptions={lessonSeriesList}
          discipleOptions={disciples}
          primaryLeaders={primaryLeaders}
        />
      </div>
      <ul className="space-y-3">
        {cellReports.map((report) => (
          <li key={report.id}>
            <CellReportListItem report={report} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CellReportsPage