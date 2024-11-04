import { getCellReports } from "../service"
import CellReportTable from "./cell-report-table"

interface PageProps {
  searchParams: { from?: string; to?: string }
}

async function CellReportListing({ searchParams }: PageProps) {
  const cellReports = await getCellReports({
    isAll: true,
  })

  return <CellReportTable data={cellReports} />
}

export default CellReportListing
