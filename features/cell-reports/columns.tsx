"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"

import { formatTime } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { SortLink } from "@/components/ui/data-table/sort-link"

import { CellReportRowActions } from "./CellReportRowActions"
import { CellReportRecord } from "./types"

export const columns: ColumnDef<CellReportRecord>[] = [
  {
    accessorFn: (row) => row.leader?.name,
    id: "leaderName",
    header: () => <SortLink title="Leader" sortValue="leaderName" />,
    cell: (props) => (
      <p className="whitespace-nowrap">
        <span className="text-sm font-semibold lg:hidden">
          Network Leader:{" "}
        </span>{" "}
        {props.row.original.leader?.name}
      </p>
    ),
  },
  {
    accessorFn: (row) =>
      row.lesson_name ? row.lesson_name : row.lesson?.title,
    id: "lesson",
    header: () => <span className="text-xs">Lesson</span>,
    cell: ({ row: { original } }) => (
      <div>
        <p>
          {original.lesson_name ? original.lesson_name : original.lesson?.title}
        </p>
        {original.assistant?.disciple ? (
          <p className="text-xs text-muted-foreground">
            Led by: {original.assistant?.disciple.name}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Led by: {original.leader.name}
          </p>
        )}
      </div>
    ),
  },
  {
    accessorKey: "type",
    id: "type",
    header: () => <SortLink title="Type" sortValue="type" />,
    cell: (props) => (
      <Badge variant={props.row.original.type}>{props.row.original.type}</Badge>
    ),
  },
  {
    accessorFn: (row) => row.attendees.length,
    id: "attendees",
    header: ({ column }) => <span className="text-xs">Attendees</span>,
    cell: ({ row }) => (
      <Badge variant="FILTER">
        {row.original.attendees.length}{" "}
        <span className="ml-1">
          {row.original.attendees.length > 1 ? "attendees" : "attendee"}
        </span>
      </Badge>
    ),
  },
  {
    accessorKey: "date",
    id: "Date",
    header: ({ column }) => <SortLink title="Date" sortValue="date" />,
    cell: (props) => (
      <div className="whitespace-nowrap">
        <p className="text-sm">
          {format(props.row.original.date, "MMM dd, yyyy")}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatTime(props.row.original.time)}
        </p>
      </div>
    ),
  },
  {
    id: "actions",
    header: () => (
      <span className="inline-block w-full text-center">Actions</span>
    ),
    cell: ({ row }) => {
      return <CellReportRowActions cellReport={row.original} />
    },
  },
]
