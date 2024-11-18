import Link from "next/link"
import { notFound } from "next/navigation"
import { ProcessAttendanceAddButton } from "@/features/process-attendance/ProcessAttendanceAddButton"
import { getProcessAttendanceDetail } from "@/features/process-attendance/queries"
import { format } from "date-fns"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

async function ProcessAttendanceDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const record = await getProcessAttendanceDetail(params.id)

  if (!record) notFound()

  const presentByLesson = new Map<string, Array<string>>()

  record.attendanceRecords.forEach((record) => {
    presentByLesson.set(
      record.process_lesson_id,
      record.process_attendees.map((a) => a.disciple_id)
    )
  })

  return (
    <div className="relative flex flex-col gap-4 overflow-hidden p-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/process-attendance">Process Attendance</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{record.description}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Table className="relative w-full overflow-auto rounded-lg border">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead colSpan={3} className="h-auto border-r py-2">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs">{record.description} </p>
                  <Badge variant="ACTIVE">
                    {record.students.length} students
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground">
                  {`Attendance sheet for ${record.description}`}
                </p>
              </div>
            </TableHead>
            <TableHead className="h-9 border-r text-right">
              <div className="space-y-0.5">
                <p className="text-xs">Teacher</p>
                <p className="text-xs text-muted-foreground">Date</p>
              </div>
            </TableHead>
            {record.attendanceRecords.map((attendance) => (
              <TableHead
                key={`attendance-record-${attendance.id}`}
                className="min-w-[140px] border-r p-2 last:border-r-0"
              >
                <div className="space-y-0.5">
                  <p className="text-xs">
                    {attendance.teacher?.name.includes("De Guzman")
                      ? "Ptr. " + attendance.teacher.name
                      : attendance.teacher?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(attendance.date, "MM/dd/yyyy")}
                  </p>
                </div>
              </TableHead>
            ))}
          </TableRow>
          <TableRow className="text-xs hover:bg-transparent">
            <TableHead className="h-9 border-r text-center">#</TableHead>
            <TableHead className="h-9 border-r">Name</TableHead>
            <TableHead className="h-9 border-r">Batch</TableHead>
            <TableHead className="h-9 border-r">Leader</TableHead>
            {record.processLessonSeries.lessons.map((lesson) => (
              <TableHead
                key={`process-lesson-${lesson.id}`}
                className="h-[34px] min-w-[140px] border-r p-0.5 last:border-r-0"
              >
                {presentByLesson.has(lesson.id) ? (
                  <span className="inline-flex items-center gap-2 px-2">
                    <CheckIcon className="size-4 text-green-500" />
                    {lesson.title.split(": ")[1]}{" "}
                  </span>
                ) : (
                  <ProcessAttendanceAddButton
                    label={lesson.title.split(": ")[1]}
                    processLessonId={lesson.id}
                    processAttendancePeriodId={record.id}
                    students={record.students.map((s) => s.disciple)}
                  />
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="[&_tr:last-child]:border-b">
          <TableRow className="py-0 hover:bg-background">
            <TableCell colSpan={4} className="bg-muted/30 py-1">
              Male
            </TableCell>
          </TableRow>
          {record.students
            .filter((d) => d.disciple.gender === "MALE")
            .map((student, index) => (
              <TableRow
                key={`student-${student.disciple_id}`}
                className="py-0  hover:bg-background"
              >
                <TableCell className="whitespace-nowrap border-r px-3 py-1.5 text-center text-muted-foreground lg:py-2">
                  {index + 1}
                </TableCell>
                <TableCell className="whitespace-nowrap border-r px-3 py-1.5 lg:py-2">
                  {student.disciple.name}
                </TableCell>
                <TableCell className="whitespace-nowrap border-r px-3 py-1.5 lg:py-2">
                  {student.disciple.encounter_batch?.batchName}
                </TableCell>
                <TableCell className="whitespace-nowrap border-r px-3 py-1.5 lg:py-2">
                  {student.disciple.leader?.name.includes("De Guzman")
                    ? "Ptr. " + student.disciple.leader.name
                    : student.disciple.leader?.name}
                </TableCell>
                {record.processLessonSeries.lessons.map((lesson) => (
                  <TableCell
                    key={`process-lesson-cell-${lesson.id}`}
                    className={cn(
                      "whitespace-nowrap border-r px-3 py-1.5 text-center last:border-r-0 lg:py-2",
                      presentByLesson.has(lesson.id)
                        ? presentByLesson
                            .get(lesson.id)
                            ?.includes(student.disciple_id)
                          ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
                          : "border border-red-400/20 bg-red-400/10 text-red-400"
                        : ""
                    )}
                  >
                    {presentByLesson.has(lesson.id)
                      ? presentByLesson
                          .get(lesson.id)
                          ?.includes(student.disciple_id)
                        ? "Present"
                        : "Absent"
                      : "--"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          <TableRow className="py-0 hover:bg-background">
            <TableCell colSpan={4} className="bg-muted/30 py-1">
              Female
            </TableCell>
          </TableRow>
          {record.students
            .filter((d) => d.disciple.gender === "FEMALE")
            .map((student, index) => (
              <TableRow
                key={`student-${student.disciple_id}`}
                className="py-0  hover:bg-background"
              >
                <TableCell className="whitespace-nowrap border-r px-3 py-1.5 text-center text-muted-foreground lg:py-2">
                  {index + 1}
                </TableCell>
                <TableCell className="whitespace-nowrap border-r px-3 py-1.5 lg:py-2">
                  {student.disciple.name}
                </TableCell>
                <TableCell className="whitespace-nowrap border-r px-3 py-1.5 lg:py-2">
                  {student.disciple.encounter_batch?.batchName}
                </TableCell>
                <TableCell className="whitespace-nowrap border-r px-3 py-1.5 lg:py-2">
                  {student.disciple.leader?.name.includes("De Guzman")
                    ? "Ptr. " + student.disciple.leader.name
                    : student.disciple.leader?.name}
                </TableCell>
                {record.processLessonSeries.lessons.map((lesson) => (
                  <TableCell
                    key={`process-lesson-cell-${lesson.id}`}
                    className={cn(
                      "whitespace-nowrap border-r px-3 py-1.5 text-center last:border-r-0 lg:py-2",
                      presentByLesson.has(lesson.id)
                        ? presentByLesson
                            .get(lesson.id)
                            ?.includes(student.disciple_id)
                          ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
                          : "border border-red-400/20 bg-red-400/10 text-red-400"
                        : ""
                    )}
                  >
                    {presentByLesson.has(lesson.id)
                      ? presentByLesson
                          .get(lesson.id)
                          ?.includes(student.disciple_id)
                        ? "Present"
                        : "Absent"
                      : "--"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default ProcessAttendanceDetailPage
