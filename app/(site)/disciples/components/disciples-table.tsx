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
import { usePrimaryLeaders } from "@/hooks/use-primary-leaders"
import { DataTableViewOptions } from "@/components/ui/data-table/column-visibility-toggle"
import DataTable from "@/components/ui/data-table/data-table"
import MobileTablePagination from "@/components/ui/data-table/mobile-table-pagination"
import { DataTablePagination } from "@/components/ui/data-table/table-pagination"
import RefreshButton from "@/components/refresh-button"

import ActivityFilter from "./activity-filter"
import { columns, DiscipleWithLeader } from "./columns"
import DiscipleBulkActions from "./disciple-bulk-actions"
import DiscipleFilters from "./disciple-filters"
import DiscipleMobileFacetFilters from "./disciple-mobile-facet-filters"
import DiscipleMobileListView from "./disciple-mobile-list-view"
import DiscipleSearch from "./disciple-search"

interface Props {
  disciples: DiscipleWithLeader[]
}

function useDiscipleTable(disciples: DiscipleWithLeader[]) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const { isAdmin } = useIsAdmin()

  const columnsToDisplay = isAdmin
    ? columns
    : columns.filter((col) => col.id !== "leaderName")

  const table = useReactTable({
    data: disciples,
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
      pagination: {
        pageSize: 100,
        pageIndex: 0,
      },
    },
    manualPagination: true,
  })

  return table
}

function DisciplesTable({ disciples }: Props) {
  const table = useDiscipleTable(disciples)
  //   search
  const searchValue =
    (table.getColumn("name")?.getFilterValue() as string) ?? ""
  const handleSearch = (searchValue: string) =>
    table.getColumn("name")?.setFilterValue(searchValue)

  const { data: leaders } = usePrimaryLeaders()

  // leaders options
  const leadersOptions =
    leaders?.map((i) => ({ label: i.name, value: i.name })) ?? []

  return (
    <>
      <div className="lg:hidden">
        <div className="mb-4 flex items-center gap-3">
          <DiscipleSearch
            placeholder={`Search ${disciples.length} disciples`}
            value={searchValue}
            onChange={handleSearch}
          />
          <DiscipleMobileFacetFilters
            table={table}
            leadersOptions={leadersOptions}
          />
        </div>
        <DiscipleMobileListView table={table} />
        <div className="py-4">
          <MobileTablePagination table={table} />
        </div>
      </div>

      <div className="hidden h-full max-h-full rounded-lg border lg:block">
        <DiscipleSearch value={searchValue} onChange={handleSearch} />
        <div className="flex items-center border-b p-2">
          <DiscipleFilters table={table} leadersOptions={leadersOptions} />
          <DiscipleBulkActions table={table} />
          <div className="ml-auto flex items-center gap-3">
            <RefreshButton />
            <ActivityFilter />
            <DataTableViewOptions table={table} />
          </div>
        </div>
        <div className="h-[calc(100%-170px)] max-h-[calc(100%-170px)] overflow-auto">
          <DataTable table={table} columnCount={columns.length} />
        </div>
        <DataTablePagination table={table} />
      </div>
    </>
  )
}

export default DisciplesTable
