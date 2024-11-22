"use client"

import { getInitials } from "@/lib/utils"
import { useWeeklyCellGroups } from "@/hooks/use-weekly-cellgroups"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function WeeklyCellReportsByLeader() {
  const reports = useWeeklyCellGroups()

  if (reports.isLoading)
    return (
      <Table>
        <TableHeader>
          <TableRow className="border-none">
            <TableHead>
              <Skeleton className="h-6 rounded bg-muted/30" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-6 rounded bg-muted/30" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-6 rounded bg-muted/30" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[1, 2, 3, 4]?.map((leader) => (
            <TableRow key={`row-loading-${leader}`} className="border-none">
              <TableCell>
                <Skeleton className="h-6 rounded bg-muted/30" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 rounded bg-muted/30" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 rounded bg-muted/30" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )

  const leaders = reports.data?.cellReports?.filter(
    (cg) => cg.cell_reports.length > 0
  )

  return (
    <Table className="rounded-lg border">
      <TableHeader>
        <TableRow className="hover:bg-muted/30">
          <TableHead>Network Leader</TableHead>
          <TableHead>Cell Groups Conducted</TableHead>
          <TableHead>Disciples Handled</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leaders?.length === 0 ? (
          <TableRow className="hover:bg-background">
            <TableCell colSpan={3}>
              <div className="p-8">
                <p className="text-center text-sm text-muted-foreground">
                  No cell reports for this week yet.
                </p>
              </div>
            </TableCell>
          </TableRow>
        ) : null}
        {leaders?.map((leader) => (
          <TableRow key={`row-${leader.id}`} className="hover:bg-background">
            <TableCell>
              <div className="flex items-center gap-2">
                <Avatar className="size-8">
                  <AvatarFallback className="bg-indigo-500/20 text-xs font-semibold text-indigo-500">
                    {getInitials(leader.name)}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm">{leader.name}</p>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="ACTIVE">
                {leader.cell_reports.length}{" "}
                {leader.cell_reports.length > 1 ? "cell groups" : "cell group"}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant="NACS">
                {leader.cell_reports.reduce(
                  (total, a) => total + a._count.attendees,
                  0
                )}{" "}
                disciples
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
