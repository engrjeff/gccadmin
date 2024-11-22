"use client"

import { ColumnDef } from "@tanstack/react-table"

import { removeUnderscores } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { SortLink } from "@/components/ui/data-table/sort-link"
import { Separator } from "@/components/ui/separator"

import { DiscipleRowActions } from "./DiscipleRowActions"
import { DiscipleRecord } from "./schema"

export const columns: ColumnDef<DiscipleRecord>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className=""
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "name",
    id: "name",
    header: () => <SortLink title="Name" sortValue="name" />,
    cell: ({ row, table }) => (
      <div className="relative">
        <p className="text-sm font-medium">{row.original.name}</p>
        <p className="flex items-center gap-x-1.5 text-xs capitalize text-muted-foreground">
          <span className="inline-block md:hidden">
            Leader: {row.original.leader?.name}
          </span>
          <Separator asChild orientation="vertical">
            <span className="inline-block h-3 md:hidden"></span>
          </Separator>
          <span>{row.original.gender.toLowerCase()},</span>
          <span>{row.original.member_type.toLowerCase()}</span>
        </p>
        <p className="mt-2 inline-block text-xs font-semibold md:hidden">
          Status:
        </p>

        <div className="absolute -right-2 -top-1 lg:hidden">
          <DiscipleRowActions
            onOpen={() => table.toggleAllPageRowsSelected(false)}
            disciple={row.original}
          />
        </div>
      </div>
    ),
  },

  {
    accessorFn: (row) => row.leader?.name,
    id: "leaderName",
    header: () => <SortLink title="Leader" sortValue="leaderName" />,
    cell: (props) => (
      <span className="whitespace-nowrap">
        {props.row.original.leader?.name}
      </span>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },

  {
    accessorKey: "cell_status",
    id: "cell_status",
    header: () => <SortLink title="Cell Status" sortValue="cell_status" />,
    cell: ({ row }) => (
      <Badge variant={row.original.cell_status}>
        <span className="mr-1 inline-block md:hidden">Cell: </span>
        {removeUnderscores(row.original.cell_status)}
      </Badge>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "church_status",
    id: "church_status",
    header: () => <SortLink title="Church Status" sortValue="church_status" />,
    cell: ({ row }) => (
      <Badge variant={row.original.church_status}>
        <span className="mr-1 inline-block md:hidden">Church: </span>
        {removeUnderscores(row.original.church_status)}
      </Badge>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "process_level",
    id: "process_level",
    header: () => <SortLink title="Process Level" sortValue="process_level" />,
    cell: ({ row }) => (
      <Badge variant={row.original.process_level}>
        <span className="mr-1 inline-block md:hidden">Process: </span>
        {removeUnderscores(row.original.process_level)}
      </Badge>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "process_level_status",
    id: "process_level_status",
    header: () => (
      <SortLink title="Process Status" sortValue="process_level_status" />
    ),
    cell: ({ row }) => (
      <Badge variant={row.original.process_level_status}>
        <span className="mr-1 inline-block md:hidden">Process Status: </span>
        {removeUnderscores(row.original.process_level_status)}
      </Badge>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      return (
        <DiscipleRowActions
          onOpen={() => table.toggleAllPageRowsSelected(false)}
          disciple={row.original}
        />
      )
    },
  },
]
