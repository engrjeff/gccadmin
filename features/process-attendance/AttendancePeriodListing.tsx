import Link from "next/link"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { removeUnderscores } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { getProcessAttendancePeriods } from "./queries"

export async function AttendancePeriodListing() {
  const attendancePeriods = await getProcessAttendancePeriods()

  if (!attendancePeriods.length)
    return (
      <div className="flex min-h-[400px] flex-1 flex-col items-center justify-center gap-2 rounded-lg border border-dashed">
        <h2>No attendance period listed yet.</h2>
        <p className="text-sm text-muted-foreground">
          Start by creating a record now.
        </p>
      </div>
    )

  return (
    <ul className="grid flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {attendancePeriods.map((item) => (
        <li key={`process-attendance-period-${item.id}`}>
          <Link href={`/process-attendance/${item.id}`}>
            <Card className="bg-muted/30 hover:border-primary">
              <CardHeader className="lg:p-4">
                <CardTitle className="text-base font-semibold">
                  {item.description}
                </CardTitle>
                <CardDescription className="flex items-center text-xs">
                  <CalendarIcon className="mr-2 size-3" />{" "}
                  {format(item.startDate, "MMM dd, yyyy")} -{" "}
                  {item.endDate
                    ? format(item.endDate, "MMM dd, yyyy")
                    : "On-going"}
                </CardDescription>
              </CardHeader>
              <CardContent className="lg:p-4">
                <Badge variant={item.processLevel}>
                  {removeUnderscores(item.processLevel)}
                </Badge>
                <Badge variant="ACTIVE" className="ml-2">
                  {item.students.length} students
                </Badge>
              </CardContent>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  )
}
