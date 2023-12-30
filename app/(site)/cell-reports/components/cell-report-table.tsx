"use client"

import { useState } from "react"
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"

import { useIsAdmin } from "@/hooks/use-isadmin"
import { useSelectedCellReport } from "@/hooks/use-selected-cell-report"
import { DataTableViewOptions } from "@/components/ui/data-table/column-visibility-toggle"
import DataTable from "@/components/ui/data-table/data-table"
import { DataTablePagination } from "@/components/ui/data-table/table-pagination"
import RefreshButton from "@/components/refresh-button"

import { CellReportRecord } from "../types"
import CellReportFacetFilters from "./cell-report-facet-filters"
import { columns } from "./columns"
import ReportDateRangeFilter from "./report-date-range-filter"

interface CellReportTableProps {
  data: CellReportRecord[]
}

function CellReportTable({ data }: CellReportTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const isAdmin = useIsAdmin()

  const setCellReport = useSelectedCellReport((state) => state.setCellReport)

  const columnsToDisplay = isAdmin
    ? columns
    : columns.filter((col) => col.id !== "leaderName")

  const table = useReactTable({
    data,
    columns: columnsToDisplay,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    enableMultiRowSelection: false,
  })

  return (
    <>
      <div className="flex items-center p-3">
        <ReportDateRangeFilter />
        <div className="ml-auto flex items-center justify-end gap-2">
          <CellReportFacetFilters table={table} />
          <RefreshButton />
          <DataTableViewOptions table={table} />
        </div>
      </div>
      <div className="h-[calc(100%-109px)] max-h-[calc(100%-109px)] overflow-auto">
        <DataTable
          table={table}
          columnCount={columns.length}
          onRowClick={(row) => setCellReport(row.original)}
        />
      </div>
      <DataTablePagination table={table} />
    </>
  )
}

export default CellReportTable
