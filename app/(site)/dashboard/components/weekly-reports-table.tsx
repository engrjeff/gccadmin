"use client"

import React from "react"
import Link from "next/link"
import { ChevronDownIcon } from "@radix-ui/react-icons"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { getCellReportData } from "../service"

interface Props {
  data: Pick<Awaited<ReturnType<typeof getCellReportData>>, "weeklyReports">
}

function WeeklyCellReportsTable({ data }: Props) {
  const [expandedRowId, setExpandedRowId] = React.useState<string>()

  const weeklyReports = data.weeklyReports

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead className="hidden lg:table-cell">
            Disciples Handled
          </TableHead>
          <TableHead>CGs Done</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {weeklyReports.cgCountByLeaderData.map((d) => (
          <React.Fragment key={`row-leader-${d.id}`}>
            <TableRow
              data-state={expandedRowId === d.id ? "open" : "closed"}
              className="group cursor-pointer"
              onClick={() =>
                setExpandedRowId((val) => (val === d.id ? undefined : d.id))
              }
            >
              <TableCell>{d.name}</TableCell>
              <TableCell className="hidden lg:table-cell">
                {d.uniqueDisciplesDuringCgCount}
              </TableCell>
              <TableCell>{d.cgCount}</TableCell>
              <TableCell>
                <ChevronDownIcon className="h-4 w-4 transition-transform group-data-[state-closed]:rotate-0 group-data-[state=open]:rotate-180" />
              </TableCell>
            </TableRow>
            {expandedRowId === d.id ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={4}>
                  <p className="mb-2 text-sm font-semibold">Breakdown</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>
                      <Link
                        href={`/disciples/${d.id}`}
                        className="hover:underline"
                      >
                        <span className="font-medium text-white">{d.name}</span>
                      </Link>{" "}
                      handled{" "}
                      <span className="font-medium text-white">
                        {d.cgCount -
                          d.cgByAssistant.reduce(
                            (total, curr) => total + curr.assistedCG,
                            0
                          )}
                      </span>{" "}
                      <span>cellgroups</span>
                    </li>
                    {d.cgByAssistant.map((c) => (
                      <li key={c.id}>
                        <Link
                          href={`/disciples/${c.id}`}
                          className="hover:underline"
                        >
                          <span className="font-medium text-white">
                            {c.name}
                          </span>
                        </Link>{" "}
                        handled{" "}
                        <span className="font-medium text-white">
                          {c.assistedCG}{" "}
                        </span>{" "}
                        {c.assistedCG > 1 ? "cellgroups" : "cellgroup"}
                      </li>
                    ))}
                  </ul>
                </TableCell>
              </TableRow>
            ) : null}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  )
}

export default WeeklyCellReportsTable
