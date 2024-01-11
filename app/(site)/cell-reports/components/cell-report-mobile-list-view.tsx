import { type Table } from "@tanstack/react-table"

import { CellReportRecord } from "../types"
import CellReportMobileListItem from "./cell-report-mobile-list-item"

interface CellReportMobileListViewProps {
  table: Table<CellReportRecord>
}

function CellReportMobileListView({ table }: CellReportMobileListViewProps) {
  return (
    <div className="lg:hidden">
      <p className="mb-4 text-sm text-muted-foreground">
        Showing {table.getFilteredRowModel().rows.length} cell reports.
      </p>
      {table.getRowModel().rows?.length ? (
        <ul className="space-y-4">
          {table.getFilteredRowModel().rows.map((row) => (
            <li
              key={`cellreport-mobile-${row.id}`}
              data-state={row.getIsSelected() && "selected"}
              onClick={() => {}}
            >
              <CellReportMobileListItem cellreport={row.original} />
            </li>
          ))}
        </ul>
      ) : (
        <div>
          <p className="h-24 text-center">No results.</p>
        </div>
      )}
    </div>
  )
}

export default CellReportMobileListView
