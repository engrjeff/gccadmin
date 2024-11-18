import Link from "next/link"
import { notFound } from "next/navigation"
import { AssignmentToggler } from "@/features/process-attendance/AssignmentToggler"
import { AttendanceToggler } from "@/features/process-attendance/AttendanceToggler"
import { ColumnFilter } from "@/features/process-attendance/ColumnFilter"
import { DevotionInput } from "@/features/process-attendance/DevotionInput"
import { ProcessAttendanceAddButton } from "@/features/process-attendance/ProcessAttendanceAddButton"
import {
  getProcessAttendanceDetail,
  GetProcessAttendanceDetailArgs,
} from "@/features/process-attendance/queries"
import { ProcessAttendee } from "@prisma/client"
import { format } from "date-fns"
import { LockIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
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
  searchParams,
}: {
  params: { id: string }
  searchParams: Omit<GetProcessAttendanceDetailArgs, "id">
}) {
  const record = await getProcessAttendanceDetail({
    id: params.id,
  })

  if (!record) notFound()

  const presentByLesson = new Map<string, Array<ProcessAttendee>>()

  record.attendanceRecords.forEach((record) => {
    presentByLesson.set(record.process_lesson_id, record.process_attendees)
  })

  const batchFilterOptions = new Map<string, { label: string; value: string }>()

  record.students
    .filter((s) => s.disciple.encounter_batch_id)
    .forEach((d) => {
      if (
        d.disciple.encounter_batch_id &&
        !batchFilterOptions.has(d.disciple.encounter_batch_id)
      ) {
        batchFilterOptions.set(d.disciple.encounter_batch_id, {
          label: d.disciple.encounter_batch?.batchName!,
          value: d.disciple.encounter_batch_id,
        })
      }
    })

  const leaderFilterOptions = new Map<
    string,
    { label: string; value: string }
  >()

  const isPresent = (lessonId: string, studentId: string) =>
    presentByLesson
      .get(lessonId)
      ?.some((d) => d.disciple_id === studentId && d.is_present)

  const hasAssignment = (lessonId: string, studentId: string) =>
    presentByLesson.get(lessonId)?.find((d) => d.disciple_id === studentId)
      ?.with_assignment

  record.students.forEach((d) => {
    if (d.disciple.leaderId && !leaderFilterOptions.has(d.disciple.leaderId)) {
      leaderFilterOptions.set(d.disciple.leaderId, {
        label: d.disciple?.leader?.name.includes("De Guzman")
          ? "Ptr. " + d.disciple?.leader?.name!
          : d.disciple?.leader?.name!,
        value: d.disciple.leaderId,
      })
    }
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
            <TableHead className="h-[34px] border-r p-0.5">
              <ColumnFilter
                title="Batch"
                filterKey="batchId"
                options={Array.from(batchFilterOptions.values())}
              />
            </TableHead>
            <TableHead className="h-[34px] border-r p-0.5">
              <ColumnFilter
                title="Leader"
                filterKey="leaderId"
                options={Array.from(leaderFilterOptions.values())}
              />
            </TableHead>
            {record.processLessonSeries.lessons.map((lesson) => (
              <TableHead
                key={`process-lesson-${lesson.id}`}
                className="h-[34px] min-w-[140px] border-r p-0.5 last:border-r-0"
              >
                {presentByLesson.has(lesson.id) ? (
                  <div className="flex items-center justify-between gap-1 pr-1">
                    <Button
                      size="icon"
                      variant="outline"
                      className="size-7 bg-muted/20"
                    >
                      <LockIcon className="size-2 text-amber-500" />
                    </Button>
                    <span>{lesson.title.split(": ")[1]}</span>
                  </div>
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
            <TableCell colSpan={4} className="border-r bg-muted/30 py-1">
              Male
            </TableCell>
            {record.processLessonSeries.lessons.map((lesson) => (
              <TableCell
                key={`subrow-male-lesson-${lesson.id}`}
                className="border-r bg-muted/30 p-0 last:border-r-0"
              >
                <div className="grid h-[29px] grid-cols-3 divide-x text-center text-xs font-semibold">
                  <div className="flex items-center justify-center">P/A</div>
                  <div className="flex items-center justify-center">Devo</div>
                  <div className="flex items-center justify-center">Assig</div>
                </div>
              </TableCell>
            ))}
          </TableRow>
          {record.students
            .filter((d) => d.disciple.gender === "MALE")
            .map((student, index) => (
              <TableRow
                key={`student-${student.disciple_id}`}
                className="py-0 hover:bg-background"
              >
                <TableCell className="whitespace-nowrap border-r bg-muted/30 px-3 py-1.5 text-center text-muted-foreground lg:py-2">
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
                {record.processLessonSeries.lessons.map((lesson, i) => (
                  <TableCell
                    key={`process-male-lesson-cell-${lesson.id}`}
                    className="whitespace-nowrap border-r p-0 text-center last:border-r-0 data-[disabled=true]:pointer-events-none"
                  >
                    <div
                      data-present={isPresent(lesson.id, student.disciple.id)}
                      className="grid grid-cols-3 divide-x text-center text-xs font-semibold"
                    >
                      {presentByLesson.has(lesson.id) ? (
                        <>
                          <AttendanceToggler
                            isPresent={isPresent(
                              lesson.id,
                              student.disciple.id
                            )}
                            studentId={student.disciple.id}
                          />
                          <DevotionInput disabled={i !== 0} />
                          <AssignmentToggler
                            hasAssignment={
                              hasAssignment(lesson.id, student.disciple.id) ??
                              null
                            }
                            studentId={student.disciple.id}
                          />
                        </>
                      ) : null}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          <TableRow className="py-0 hover:bg-background">
            <TableCell colSpan={4} className="border-r bg-muted/30 py-1">
              Female
            </TableCell>
            {record.processLessonSeries.lessons.map((lesson) => (
              <TableCell
                key={`subrow-female-lesson-${lesson.id}`}
                className="border-r bg-muted/30 p-0 last:border-r-0"
              >
                <div className="grid h-[29px] grid-cols-3 divide-x text-center text-xs font-semibold">
                  <div className="flex items-center justify-center">P/A</div>
                  <div className="flex items-center justify-center">Devo</div>
                  <div className="flex items-center justify-center">Assig</div>
                </div>
              </TableCell>
            ))}
          </TableRow>
          {record.students
            .filter((d) => d.disciple.gender === "FEMALE")
            .map((student, index) => (
              <TableRow
                key={`student-${student.disciple_id}`}
                className="py-0 hover:bg-background"
              >
                <TableCell className="whitespace-nowrap border-r bg-muted/30 px-3 py-1.5 text-center text-muted-foreground lg:py-2">
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
                {record.processLessonSeries.lessons.map((lesson, i) => (
                  <TableCell
                    key={`process-female-lesson-cell-${lesson.id}`}
                    className="whitespace-nowrap border-r p-0 text-center last:border-r-0 data-[disabled=true]:pointer-events-none"
                  >
                    <div
                      data-present={isPresent(lesson.id, student.disciple.id)}
                      className="grid grid-cols-3 divide-x text-center text-xs font-semibold"
                    >
                      {presentByLesson.has(lesson.id) ? (
                        <>
                          <AttendanceToggler
                            isPresent={isPresent(
                              lesson.id,
                              student.disciple.id
                            )}
                            studentId={student.disciple.id}
                          />
                          <DevotionInput disabled={i !== 0} />
                          <AssignmentToggler
                            hasAssignment={
                              hasAssignment(lesson.id, student.disciple.id) ??
                              null
                            }
                            studentId={student.disciple.id}
                          />
                        </>
                      ) : null}
                    </div>
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
