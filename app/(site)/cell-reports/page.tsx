import PageTitle from "@/components/page-title"

import { getDisciples, getPrimaryLeaders } from "../disciples/service/disciples"
import { getLessonSeries } from "../resources/service"
import CellReportForm from "./components/cell-report-form"
import CellReportTable from "./components/cell-report-table"
import { getCellReports } from "./service"

async function CellReportsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string }
}) {
  const lessonSeriesData = getLessonSeries()
  const disciplesData = getDisciples({ isActive: "true" })
  const primaryLeadersData = getPrimaryLeaders()
  const cellReportsData = getCellReports({
    from: searchParams.from,
    to: searchParams.to,
  })

  const [lessonSeriesList, { disciples }, primaryLeaders, cellReports] =
    await Promise.all([
      lessonSeriesData,
      disciplesData,
      primaryLeadersData,
      cellReportsData,
    ])

  const leadersOptions = primaryLeaders.map((d) => ({
    value: d.name,
    label: d.name,
  }))

  return (
    <>
      <div className="flex items-start justify-between">
        <PageTitle title="Cell Reports" subtitle="List of cell group reports" />
        <CellReportForm
          lessonOptions={lessonSeriesList}
          discipleOptions={disciples}
          primaryLeaders={primaryLeaders}
        />
      </div>
      <div className="h-[calc(100%-64px)] max-h-[calc(100%-64px)]">
        <CellReportTable data={cellReports} leadersOptions={leadersOptions} />
      </div>
    </>
  )
}

export default CellReportsPage
