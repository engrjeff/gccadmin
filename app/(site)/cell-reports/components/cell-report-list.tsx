import Link from "next/link"
import { format } from "date-fns"

import PageTitle from "@/components/page-title"

import {
  getDisciples,
  getPrimaryLeaders,
} from "../../disciples/service/disciples"
import { getLessonSeries } from "../../resources/service"
import { getCellReports } from "../service"
import CellReportForm from "./cell-report-form"

async function CellReportList() {
  const lessonSeriesData = getLessonSeries()
  const disciplesData = getDisciples()
  const primaryLeadersData = getPrimaryLeaders()
  const cellReportsData = getCellReports()

  const [lessonSeriesList, { disciples, user }, primaryLeaders, cellReports] =
    await Promise.all([
      lessonSeriesData,
      disciplesData,
      primaryLeadersData,
      cellReportsData,
    ])

  const isAdmin = user.role === "ADMIN"

  return (
    <>
      <div className="flex items-center justify-between">
        <PageTitle title="Cell Reports" subtitle="List of cell group reports" />
        <CellReportForm
          lessonOptions={lessonSeriesList}
          discipleOptions={disciples}
          primaryLeaders={primaryLeaders}
        />
      </div>
      <ul className="mt-6 space-y-3">
        {cellReports.map((report) => (
          <li key={report.id}>
            <Link href={`/cell-reports/${report.id}`}>
              <div className="grid grid-cols-2 items-center rounded-lg border p-4 hover:border-primary">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">
                    {report.lesson_name
                      ? report.lesson_name
                      : report.lesson?.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {format(report.date, "MMMM dd, yyyy")} &mdash;
                    {report.time}
                  </p>
                </div>
                {isAdmin && (
                  <p className="text-sm text-muted-foreground">
                    {report.leader.name}
                  </p>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export default CellReportList
