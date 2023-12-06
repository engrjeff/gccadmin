import PageTitle from "@/components/page-title"

import CellReportAddButton from "./components/cell-report-add-button"

function CellReportsPage() {
  return (
    <>
      <div className="mb-4 flex justify-between">
        <PageTitle
          title="Cell Reports"
          subtitle="Manage your cell reports here"
        />
        <CellReportAddButton />
      </div>
    </>
  )
}

export default CellReportsPage
