import { type Metadata } from "next"

import BackButton from "@/components/back-button"
import PageTitle from "@/components/page-title"

import CellReportEditForm from "../../components/cell-report-edit-form"
import { getCellReportById } from "../../service"

export const generateMetadata = async ({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> => {
  const cellReport = await getCellReportById(params.id)

  const ledBy = cellReport.assistant_id
    ? cellReport.assistant?.disciple.name
    : cellReport.leader.name
  const lesson = cellReport.lessonId
    ? cellReport.lesson?.title
    : cellReport.lesson_name

  return {
    title: `Edit Cell Report: ${lesson}-${ledBy}`,
  }
}

async function CellReportEditPage({ params }: { params: { id: string } }) {
  const cellReport = await getCellReportById(params.id)

  const ledBy = cellReport.assistant_id
    ? cellReport.assistant?.disciple.name
    : cellReport.leader.name
  const lesson = cellReport.lessonId
    ? cellReport.lesson?.title
    : cellReport.lesson_name

  return (
    <div className="max-h-full space-y-4">
      <BackButton />
      <div className="mx-auto max-w-screen-lg space-y-4">
        <PageTitle
          title={`Edit Cell Report: ${lesson} - ${ledBy}`}
          subtitle="Make sure to save your changes."
        />
        <CellReportEditForm cellReport={cellReport} />
      </div>
    </div>
  )
}

export default CellReportEditPage
