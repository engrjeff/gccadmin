"use client"

import { useState } from "react"
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { DataTableViewOptions } from "@/components/ui/data-table/column-visibility-toggle"
import DataTable from "@/components/ui/data-table/data-table"
import { DataTablePagination } from "@/components/ui/data-table/table-pagination"
import { Input } from "@/components/ui/input"

import { columns, type DiscipleWithLeader } from "./columns"
import DiscipleBulkActions from "./disciple-bulk-actions"
import DiscipleFilters from "./disciple-filters"

interface DisciplesTableProps {
  data: DiscipleWithLeader[]
}

export function DisciplesTable({ data }: DisciplesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data,
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

  const leaders = data
    .filter((d) => d.isPrimary)
    .map((i) => ({ label: i.name, value: i.name }))

  return (
    <>
      <div className="flex h-16 items-center gap-4">
        <Input
          placeholder="Filter by name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[230px]"
        />
        <DiscipleFilters table={table} leadersOptions={leaders} />
        <DiscipleBulkActions table={table} />
        <DataTableViewOptions table={table} />
      </div>

      <DataTable table={table} columnCount={columns.length} />
      {/* Pagination */}
      <DataTablePagination table={table} />
    </>
  )
}
