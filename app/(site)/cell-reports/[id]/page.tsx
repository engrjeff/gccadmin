import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import PageTitle from "@/components/page-title"

import { getCellReportById } from "../service"

async function ReportDetailPage({ params }: { params: { id: string } }) {
  const report = await getCellReportById(params.id)

  return (
    <div>
      <div className="flex items-center justify-between">
        <PageTitle
          title={
            report.lesson_name ? report.lesson_name : report.lesson?.title!
          }
          subtitle={format(report.date, "MMMM dd, yyyy")}
        />
        <Button size="sm" variant="secondary">
          Print as PDF
        </Button>
      </div>
    </div>
  )
}

export default ReportDetailPage
