import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import PageTitle from "@/components/page-title"

import CellReportForm from "../components/cell-report-form"

function CreateCellReportPage() {
  return (
    <div className="max-h-full space-y-4">
      <Link
        href="/cell-reports"
        className="inline-flex items-center gap-3 font-medium hover:underline"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="sr-only">Back to </span>
        <span>Cell Reports</span>
      </Link>
      <div className="mx-auto max-w-screen-lg space-y-4">
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
