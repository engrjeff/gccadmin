"use client"

import {
  CellReport,
  CellReportAssistant,
  CellReportAttendees,
  Disciple,
  Lesson,
} from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"

import { cn, formatTime } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { DataTableColumnHeader } from "@/components/ui/data-table/column-header"
import DiscipleContextMenu from "@/components/disciple-context-menu"

import CellReportRowActions from "./cell-report-row-actions"

const typeColor: Record<CellReport["type"], string> = {
  SOULWINNING: "text-green-500",
  DISCIPLESHIP: "text-orange-500",
  OPEN: "text-sky-500",
}

export type CellReportRecord = CellReport & {
  leader: Disciple
  lesson: Lesson | null
  attendees: CellReportAttendees[]
  assistant: CellReportAssistant | null
}

export const columns: ColumnDef<CellReportRecord>[] = [
  {
    accessorFn: (row) => row.leader.name,
    id: "leaderName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Leader" />
    ),
    cell: (props) => (
      <DiscipleContextMenu disciple={props.row.original.leader} />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorFn: (row) =>
      row.lesson_name ? row.lesson_name : row.lesson?.title,
    id: "lesson",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Lesson" />
    ),
    cell: (props) => props.getValue(),
  },
  {
    accessorKey: "type",
    id: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: (props) => (
      <Badge variant="outline" className="capitalize">
        <span
          className={cn("mr-2 scale-150", typeColor[props.row.original.type])}
        >
          &#x2022;
        </span>
        {props.row.original.type.split("_").join(" ")}
      </Badge>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorFn: (row) => row.attendees.length,
    id: "attendees",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Attendees" />
    ),
    cell: (props) => props.getValue(),
  },
  {
    accessorKey: "date",
    id: "Date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: (props) => (
      <span className="whitespace-nowrap">
        {format(props.row.original.date, "MMM dd, yyyy")} at{" "}
        {formatTime(props.row.original.time)}
      </span>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return <CellReportRowActions cellReportId={row.original.id} />
    },
  },
]
