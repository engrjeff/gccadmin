import BackButton from "@/components/back-button"
import PageTitle from "@/components/page-title"

import CellReportForm from "../components/cell-report-form"

function CreateCellReportPage() {
  return (
    <div className="max-h-full space-y-4 overflow-y-auto px-4 lg:px-6">
      <BackButton />
      <div className="mx-auto max-w-screen-lg space-y-4 pb-6 md:pb-0">
        <PageTitle
          title="New Cell Report"
          subtitle="Fill in the form to create a new cell report record."
        />
        <CellReportForm />
      </div>
    </div>
  )
}

export default CreateCellReportPage
