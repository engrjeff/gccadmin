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
import { DataTableViewOptions } from "@/components/ui/data-table/column-visibility-toggle"
import DataTable from "@/components/ui/data-table/data-table"
import { DataTablePagination } from "@/components/ui/data-table/table-pagination"
import RefreshButton from "@/components/refresh-button"

import CellReportFacetFilters from "./cell-report-facet-filters"
import { columns, type CellReportRecord } from "./columns"
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
  })

  return (
    <>
      <div className="flex items-center px-2 py-3">
        <ReportDateRangeFilter />
        <div className="ml-auto flex items-center justify-end gap-2">
          <CellReportFacetFilters table={table} />
          <RefreshButton />
          <DataTableViewOptions table={table} />
        </div>
      </div>
      <DataTable table={table} columnCount={columns.length} />
      <DataTablePagination table={table} />
    </>
  )
}

export default CellReportTable
