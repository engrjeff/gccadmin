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

import { DataTableViewOptions } from "@/components/ui/data-table/column-visibility-toggle"
import DataTable from "@/components/ui/data-table/data-table"
import { DataTablePagination } from "@/components/ui/data-table/table-pagination"
import RefreshButton from "@/components/refresh-button"

import ActivityFilter from "./activity-filter"
import { columns, DiscipleWithLeader } from "./columns"
import DiscipleFilters from "./disciple-filters"
import DiscipleSearch from "./disciple-search"

function DisciplesTable({ disciples }: { disciples: DiscipleWithLeader[] }) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data: disciples,
    columns,
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

  //   search
  const searchValue =
    (table.getColumn("name")?.getFilterValue() as string) ?? ""
  const handleSearch = (searchValue: string) =>
    table.getColumn("name")?.setFilterValue(searchValue)

  // leaders options
  const leadersOptions = disciples
    .filter((d) => d.isPrimary)
    .map((i) => ({ label: i.name, value: i.name }))
    .sort((a, b) => (a.label > b.label ? 1 : -1))

  return (
    <>
      <DiscipleSearch value={searchValue} onChange={handleSearch} />
      <div className="flex items-center border-b px-2 py-3">
        <DiscipleFilters table={table} leadersOptions={leadersOptions} />
        <div className="ml-auto flex items-center gap-3">
          <RefreshButton />
          <ActivityFilter />
          <DataTableViewOptions table={table} />
        </div>
      </div>
      <div className="data-table-container">
        <DataTable table={table} columnCount={columns.length} />
      </div>
      <DataTablePagination table={table} />
    </>
  )
}

export default DisciplesTable
