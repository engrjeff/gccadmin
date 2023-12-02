"use client"

import Link from "next/link"
import { Disciple } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { Verified } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/ui/data-table/column-header"

import DiscipleRowActions from "./disciple-row-actions"

const memberColorMap: Record<Disciple["member_type"], string> = {
  KIDS: "text-black bg-amber-500",
  MEN: "text-black bg-sky-500",
  WOMEN: "text-black bg-pink-500",
  YOUTH: "text-black bg-emerald-500",
  YOUNGPRO: "text-black bg-orange-500",
}

const cellStatusColorMap: Record<Disciple["cell_status"], string> = {
  FIRST_TIMER: "text-black bg-emerald-500",
  SECOND_TIMER: "text-black bg-sky-500",
  THIRD_TIMER: "text-black bg-blue-500",
  REGULAR: "text-black bg-primary",
}

const churchStatusColorMap: Record<Disciple["church_status"], string> = {
  NACS: "text-black bg-red-500",
  ACS: "text-black bg-sky-500",
  REGULAR: "text-black bg-primary",
}

const processColorMap: Record<Disciple["process_level"], string> = {
  NONE: "text-black bg-red-500",
  PREENC: "text-black bg-indigo-300",
  ENCOUNTER: "text-black bg-indigo-400",
  LEADERSHIP_1: "text-black bg-indigo-500",
  LEADERSHIP_2: "text-black bg-indigo-600",
  LEADERSHIP_3: "text-black bg-primary",
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
    cell: (props) => (
      <Link
        href={`/disciples/${props.row.original.id}`}
        className="inline-block hover:underline"
      >
        <span className="flex items-center gap-2 whitespace-nowrap">
          {props.row.getValue("name")}
          {props.row.original.isPrimary ? (
            <Verified className="h-4 w-4 text-sky-500" />
          ) : null}{" "}
        </span>
      </Link>
    ),
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
      <Badge
        className="capitalize"
        variant={props.row.getValue("gender") === "MALE" ? "info" : "pink"}
      >
        {String(props.row.getValue("gender")).toLowerCase()}
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
      <Badge
        className={cn(
          "capitalize",
          memberColorMap[props.row.original.member_type]
        )}
      >
        {String(props.row.getValue("member_type")).toLowerCase()}
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
      <Badge
        className={cn(
          "capitalize",
          cellStatusColorMap[props.row.original.cell_status]
        )}
      >
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
      <Badge
        className={cn(
          "capitalize",
          churchStatusColorMap[props.row.original.church_status]
        )}
      >
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
      <Badge
        className={cn(
          "capitalize",
          processColorMap[props.row.original.process_level]
        )}
      >
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
