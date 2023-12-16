"use client"

import { Disciple } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/ui/data-table/column-header"
import DiscipleContextMenu from "@/components/disciple-context-menu"

import DiscipleRowActions from "./disciple-row-actions"

const memberColorMap: Record<Disciple["member_type"], string> = {
  KIDS: "text-amber-500",
  MEN: "text-sky-500",
  WOMEN: "text-pink-500",
  YOUTH: "text-emerald-500",
  YOUNGPRO: "text-orange-500",
}

const cellStatusColorMap: Record<Disciple["cell_status"], string> = {
  FIRST_TIMER: "text-emerald-500",
  SECOND_TIMER: "text-sky-500",
  THIRD_TIMER: "text-blue-500",
  REGULAR: "text-primary",
}

const churchStatusColorMap: Record<Disciple["church_status"], string> = {
  NACS: "text-red-500",
  ACS: "text-sky-500",
  REGULAR: "text-primary",
}

const processColorMap: Record<Disciple["process_level"], string> = {
  NONE: "text-red-500",
  PREENC: "text-indigo-300",
  ENCOUNTER: "text-indigo-400",
  LEADERSHIP_1: "text-indigo-500",
  LEADERSHIP_2: "text-indigo-600",
  LEADERSHIP_3: "text-primary",
}

export type DiscipleWithLeader = Disciple & { leader: { name: string } | null }

export const columns: ColumnDef<DiscipleWithLeader>[] = [
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: (props) => <DiscipleContextMenu disciple={props.row.original} />,
  },
  {
    accessorFn: (row) => row.leader?.name,
    id: "leaderName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Leader" />
    ),
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
    accessorKey: "gender",
    id: "gender",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gender" />
    ),
    cell: (props) => (
      <Badge variant="outline" className="capitalize">
        <span
          className={cn("mr-2 scale-150", {
            "text-rose-500": props.row.original.gender === "FEMALE",
            "text-sky-500": props.row.original.gender === "MALE",
          })}
        >
          &#x2022;
        </span>
        {props.row.original.gender}
      </Badge>
    ),
  },
  {
    accessorKey: "member_type",
    id: "member_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Member Type" />
    ),
    cell: (props) => (
      <Badge variant="outline" className={cn("capitalize")}>
        <span
          className={cn(
            "mr-2 scale-150",
            memberColorMap[props.row.original.member_type]
          )}
        >
          &#x2022;
        </span>
        {props.row.original.member_type.toLowerCase()}
      </Badge>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "cell_status",
    id: "cell_status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cell Status" />
    ),
    cell: (props) => (
      <Badge variant="outline" className={cn("capitalize")}>
        <span
          className={cn(
            "mr-2 scale-150",
            cellStatusColorMap[props.row.original.cell_status]
          )}
        >
          &#x2022;
        </span>
        {props.row.original.cell_status.split("_").join(" ").toLowerCase()}
      </Badge>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "church_status",
    id: "church_status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Church Status" />
    ),
    cell: (props) => (
      <Badge variant="outline" className={cn("capitalize")}>
        <span
          className={cn(
            "mr-2 scale-150",
            churchStatusColorMap[props.row.original.church_status]
          )}
        >
          &#x2022;
        </span>
        {props.row.original.church_status === "REGULAR"
          ? props.row.original.church_status.toLowerCase()
          : props.row.original.church_status.split("_").join(" ")}
      </Badge>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "process_level",
    id: "process_level",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Process Level" />
    ),
    cell: (props) => (
      <Badge variant="outline" className={cn("capitalize")}>
        <span
          className={cn(
            "mr-2 scale-150",
            processColorMap[props.row.original.process_level]
          )}
        >
          &#x2022;
        </span>
        {props.row.original.process_level.split("_").join(" ").toLowerCase()}
      </Badge>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return <DiscipleRowActions disciple={row.original} />
    },
  },
]
