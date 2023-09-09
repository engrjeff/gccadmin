"use client"

import React, { useState } from "react"
import Link from "next/link"
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
import { addDays, previousSunday } from "date-fns"
import { DateRange } from "react-day-picker"

import { Option } from "@/types/common"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import DateRangePicker from "@/components/ui/data-range-picker"
import { DataTableViewOptions } from "@/components/ui/data-table/column-visibility-toggle"
import DataTable from "@/components/ui/data-table/data-table"
import { DataTableFacetedFilter } from "@/components/ui/data-table/faceted-filter"
import { DataTablePagination } from "@/components/ui/data-table/table-pagination"

import { columns, type CellReportRecord } from "./columns"

interface CellReportTableProps {
  data: CellReportRecord[]
  leadersOptions: Option[]
}

function CellReportTable({ data, leadersOptions }: CellReportTableProps) {
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

  const firstDay = previousSunday(new Date())

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: firstDay,
    to: addDays(firstDay, 6),
  })

  return (
    <>
      <div className="flex h-16 items-center gap-4">
        <DateRangePicker dateRange={date} onDateRangeChange={setDate} />
        <Link
          className={cn(
            buttonVariants({ variant: "secondary", size: "sm" }),
            "h-8"
          )}
          href={{
            pathname: "/cell-reports",
            query: {
              from: date?.from?.toISOString(),
              to: date?.to?.toISOString(),
            },
          }}
        >
          Filter by Date
        </Link>
        <div className="ml-auto flex items-center justify-end gap-4">
          {table.getColumn("type") && (
            <DataTableFacetedFilter
              column={table.getColumn("type")}
              title="Cell Type"
              options={["SOULWINNING", "OPEN", "DISCIPLESHIP"].map((i) => ({
                label: i,
                value: i,
              }))}
            />
          )}
          {table.getColumn("leader_name") && (
            <DataTableFacetedFilter
              column={table.getColumn("leader_name")}
              title="Leader"
              options={leadersOptions}
            />
          )}
          <DataTableViewOptions table={table} />
        </div>
      </div>
      <DataTable table={table} columnCount={columns.length} />
      {/* Pagination */}
      <DataTablePagination table={table} />
    </>
  )
}

export default CellReportTable
