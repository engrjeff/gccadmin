"use client"

import { Disciple } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import {
  ArrowLeftRight,
  Edit,
  Eye,
  MoreHorizontal,
  Trash,
  UserCheck,
  Verified,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/ui/data-table/column-header"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import DiscipleRowActions from "./disciple-row-actions"

const memberColorMap: Record<Disciple["member_type"], string> = {
  KIDS: "text-amber-500",
  MEN: "text-sky-500",
  WOMEN: "text-pink-500",
  YOUTH: "text-emerald-500",
  YOUNGPRO: "text-orange-500",
}

export const columns: ColumnDef<
  Disciple & { leader: { name: string } | null }
>[] = [
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
      <span className="flex items-center gap-2">
        {props.row.getValue("name")}
        {props.row.original.isPrimary ? (
          <Verified className="h-4 w-4 text-sky-500" />
        ) : null}{" "}
      </span>
    ),
  },
  {
    accessorFn: (row) => row.leader?.name,
    id: "leaderName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Leader" />
    ),
    cell: (props) => props.getValue(),
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
          className={cn(
            "mr-2 scale-150",
            props.row.original.gender === "MALE"
              ? "text-sky-700"
              : "text-pink-700"
          )}
        >
          &#x2022;
        </span>
        {props.row.getValue("gender")}
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
      <Badge variant="outline" className="capitalize">
        <span
          className={cn(
            "mr-2 scale-150",
            memberColorMap[props.row.original.member_type]
          )}
        >
          &#x2022;
        </span>
        {props.row.getValue("member_type")}
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
      <Badge variant="outline" className="capitalize">
        {props.row.original.process_level}
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
