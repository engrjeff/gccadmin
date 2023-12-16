"use client"

import { useState } from "react"
import { Disciple } from "@prisma/client"
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

import DiscipleBulkActions from "../old_components/disciple-bulk-actions"
import ActivityFilter from "./activity-filter"
import { columns, DiscipleWithLeader } from "./columns"
import DiscipleFilters from "./disciple-filters"
import DiscipleSearch from "./disciple-search"

interface Props {
  disciples: DiscipleWithLeader[]
  leaders: Disciple[]
}

function DisciplesTable({ disciples, leaders }: Props) {
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
  const leadersOptions = leaders.map((i) => ({ label: i.name, value: i.name }))

  return (
    <>
      <DiscipleSearch value={searchValue} onChange={handleSearch} />
      <div className="flex items-center border-b px-2 py-3">
        <DiscipleFilters table={table} leadersOptions={leadersOptions} />
        <DiscipleBulkActions table={table} />
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
