"use client"

import { Suspense, useState } from "react"
import { ProcessLevel } from "@prisma/client"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { cn } from "@/lib/utils"
import { useIsAdmin } from "@/hooks/use-isadmin"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { columns } from "./columns"
import { DiscipleBulkActions } from "./DiscipleBulkActions"
import { DisciplePagination } from "./DisciplePagination"
import { DiscipleRecord, PageInfo } from "./schema"

interface Props {
  disciples: DiscipleRecord[]
  pageInfo: PageInfo
}

export function DisciplesTable({ disciples, pageInfo }: Props) {
  const [rowSelection, setRowSelection] = useState({})

  const { isAdmin } = useIsAdmin()

  const columnsToDisplay = isAdmin
    ? columns
    : columns.filter((col) => col.id !== "leaderName")

  const table = useReactTable({
    data: disciples,
    columns: columnsToDisplay,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
  })

  const selected = table
    .getSelectedRowModel()
    .rows.map((row) => row.original.id)

  const disableProcessStatusAction = table
    .getSelectedRowModel()
    .rows.some((row) => row.original.process_level === ProcessLevel.NONE)

  return (
    <>
      <Table className="relative w-full overflow-auto rounded-lg border lg:rounded-none lg:border-none">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="hidden border-t hover:bg-transparent lg:table-row"
            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="flex flex-wrap items-center p-2 hover:bg-background lg:table-row lg:py-0"
                onClick={() => {}}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      "whitespace-nowrap px-2 py-1 lg:px-3 lg:py-1.5",
                      ["select", "actions", "leaderName"].includes(
                        cell.column.id
                      )
                        ? "hidden lg:table-cell"
                        : "",
                      ["name"].includes(cell.column.id)
                        ? "w-full lg:w-auto"
                        : "pr-0"
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-background">
              <TableCell colSpan={columns.length} className="h-40">
                <div className="flex h-full items-center justify-center rounded-lg border border-dashed text-center text-muted-foreground">
                  No results.
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <DisciplePagination pageInfo={pageInfo} />

      {table.getSelectedRowModel().rows.length ? (
        <Suspense>
          <DiscipleBulkActions
            selectedDisciples={selected}
            disableProcessStatus={disableProcessStatusAction}
            onAfterSave={() => table.toggleAllPageRowsSelected(false)}
          />
        </Suspense>
      ) : null}
    </>
  )
}
