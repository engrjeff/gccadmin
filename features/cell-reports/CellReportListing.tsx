import { CellReportPagination } from "./CellReportPagination"
import { CellReportTable } from "./CellReportTable"
import { getCellReports } from "./queries"

export async function CellReportListing({
  searchParams,
}: {
  searchParams: any
}) {
  const { cellReports, pageInfo } = await getCellReports(searchParams)

  return (
    <>
      <CellReportTable
        key={JSON.stringify(searchParams)}
        cellReports={cellReports}
      />
      <CellReportPagination pageInfo={pageInfo} />
    </>
  )
}
