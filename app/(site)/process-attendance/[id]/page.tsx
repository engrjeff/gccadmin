import Link from "next/link"
import { notFound } from "next/navigation"
import { BatchFilter } from "@/features/process-attendance/BatchFilter"
import { LeaderFilter } from "@/features/process-attendance/LeaderFilter"
import { ProcessAttendanceAddButton } from "@/features/process-attendance/ProcessAttendanceAddButton"
import {
  getProcessAttendanceDetail,
  GetProcessAttendanceDetailArgs,
} from "@/features/process-attendance/queries"
import { ProcessAttendee } from "@prisma/client"
import { format } from "date-fns"
import { LockIcon } from "lucide-react"

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
    leaderId: searchParams?.leaderId,
    batchId: searchParams?.batchId,
  })

  if (!record) notFound()

  const presentByLesson = new Map<string, Array<ProcessAttendee>>()

  record.attendanceRecords.forEach((record) => {
    presentByLesson.set(record.process_lesson_id, record.process_attendees)
  })

  const isPresent = (lessonId: string, studentId: string) =>
    presentByLesson
      .get(lessonId)
      ?.some((d) => d.disciple_id === studentId && d.is_present)

  const hasAssignment = (lessonId: string, studentId: string) =>
    presentByLesson.get(lessonId)?.find((d) => d.disciple_id === studentId)
      ?.with_assignment

  const male = record.students.filter((d) => d.disciple.gender === "MALE")

  const female = record.students.filter((d) => d.disciple.gender === "FEMALE")

  function getAttendee(lessonId: string, studentId: string) {
    return presentByLesson.has(lessonId)
      ? presentByLesson.get(lessonId)?.find((d) => d.disciple_id === studentId)
      : "NA"
  }

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

      <div className="relative w-full flex-1 overflow-auto rounded-lg border">
        <table className="mb-4 w-full caption-bottom border-separate border-spacing-0 text-sm">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead
                colSpan={2}
                className="sticky left-0 h-auto border-r bg-gray-900 py-2"
              >
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
              <TableHead colSpan={2} className="h-9 border-r text-right">
                <div className="space-y-0.5">
                  <p className="text-xs">Teacher</p>
                  <p className="text-xs text-muted-foreground">Date</p>
                </div>
              </TableHead>
              {record.attendanceRecords.map((attendance) => (
                <TableHead
                  key={`attendance-record-${attendance.id}`}
                  className="min-w-[140px] border-r p-2"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs">
                      {attendance.teacher?.name.includes("De Guzman")
                        ? "Ptr. " + attendance.teacher.name
                        : attendance.teacher?.name}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        {format(attendance.date, "MM/dd/yyyy")}
                      </p>

                      <p className="text-xs">
                        {attendance.process_attendees.length} /{" "}
                        {record.students.length}
                      </p>
                    </div>
                  </div>
                </TableHead>
              ))}
            </TableRow>
            <TableRow className="text-xs hover:bg-transparent">
              <TableHead className="sticky left-0 top-0 z-40 h-9 w-[39.53px] border-y border-r bg-gray-900 text-center">
                #
              </TableHead>
              <TableHead className="sticky left-[39.53px] top-0 z-40 h-9 border-y border-r bg-gray-900">
                Name
              </TableHead>
              <TableHead className="sticky top-0 z-30 h-[34px] border-y border-r bg-gray-900 p-0.5">
                <BatchFilter />
              </TableHead>
              <TableHead className="sticky top-0 z-30 h-[34px] border-y border-r bg-gray-900 p-0.5">
                <LeaderFilter />
              </TableHead>
              {record.processLessonSeries.lessons.map((lesson) => (
                <TableHead
                  key={`process-lesson-${lesson.id}`}
                  className="sticky top-0 z-30 h-[34px] min-w-[140px] border-y border-r bg-gray-900 p-0.5 last:border-r-0"
                >
                  {presentByLesson.has(lesson.id) ? (
                    <div className="flex items-center justify-between gap-1 px-1">
                      <span>{lesson.title.split(": ")[1]}</span>
                      <LockIcon className="size-4 text-amber-500" />
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
            {male.length ? (
              <TableRow className="py-0 hover:bg-background">
                <TableCell
                  colSpan={2}
                  className="sticky left-0 border-b border-r bg-gray-900 py-1"
                >
                  Male
                </TableCell>
                <TableCell className="border-b border-r bg-gray-900 py-1"></TableCell>
                <TableCell className="border-b border-r bg-gray-900 py-1"></TableCell>
                {record.processLessonSeries.lessons.map((lesson) => (
                  <TableCell
                    key={`subrow-male-lesson-${lesson.id}`}
                    className="border-b border-r bg-gray-900 p-0 last:border-r-0"
                  >
                    <div className="grid h-[29px] grid-cols-3 divide-x text-center text-xs font-semibold">
                      <div className="flex items-center justify-center">
                        P/A
                      </div>
                      <div className="flex items-center justify-center">
                        Devo
                      </div>
                      <div className="flex items-center justify-center">
                        Assig
                      </div>
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ) : null}
            {male.map((student, index) => (
              <TableRow
                key={`student-${student.disciple_id}`}
                className="py-0 hover:bg-background"
              >
                <TableCell className="sticky left-0 z-20 size-9 whitespace-nowrap border-b border-r bg-gray-900 px-3 py-1.5 text-center text-muted-foreground lg:py-2">
                  {index + 1}
                </TableCell>
                <TableCell className="sticky left-[39.53px] z-20 whitespace-nowrap border-b border-r bg-background px-3 py-1.5 lg:py-2">
                  {student.disciple.name}
                </TableCell>
                <TableCell className="whitespace-nowrap border-b border-r px-3 py-1.5 lg:py-2">
                  {student.disciple.encounter_batch?.batchName}
                </TableCell>
                <TableCell className="whitespace-nowrap border-b border-r px-3 py-1.5 lg:py-2">
                  {student.disciple.leader?.name.includes("De Guzman")
                    ? "Ptr. " + student.disciple.leader.name
                    : student.disciple.leader?.name}
                </TableCell>
                {record.processLessonSeries.lessons.map((lesson, i) => (
                  <TableCell
                    key={`process-male-lesson-cell-${lesson.id}`}
                    className="whitespace-nowrap border-b border-r p-px text-center align-baseline last:border-r-0 data-[disabled=true]:pointer-events-none"
                  >
                    <AttendeeDataCell
                      attendee={getAttendee(lesson.id, student.disciple_id)}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {female.length ? (
              <TableRow className="py-0 hover:bg-background">
                <TableCell
                  colSpan={2}
                  className="sticky left-0 border-b border-r bg-gray-900 py-1"
                >
                  Female
                </TableCell>
                <TableCell className="border-b border-r bg-gray-900 py-1"></TableCell>
                <TableCell className="border-b border-r bg-gray-900 py-1"></TableCell>
                {record.processLessonSeries.lessons.map((lesson) => (
                  <TableCell
                    key={`subrow-female-lesson-${lesson.id}`}
                    className="border-b border-r bg-gray-900 p-0 last:border-r-0"
                  >
                    <div className="grid h-[29px] grid-cols-3 divide-x text-center text-xs font-semibold">
                      <div className="flex items-center justify-center">
                        P/A
                      </div>
                      <div className="flex items-center justify-center">
                        Devo
                      </div>
                      <div className="flex items-center justify-center">
                        Assig
                      </div>
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ) : null}
            {female.map((student, index) => (
              <TableRow
                key={`student-${student.disciple_id}`}
                className="py-0 hover:bg-background"
              >
                <TableCell className="sticky left-0 z-20 size-9 whitespace-nowrap border-b border-r bg-gray-900 px-3 py-1.5 text-center text-muted-foreground lg:py-2">
                  {index + 1}
                </TableCell>
                <TableCell className="sticky left-[39.53px] z-20 whitespace-nowrap border-b border-r bg-background px-3 py-1.5 lg:py-2">
                  {student.disciple.name}
                </TableCell>
                <TableCell className="whitespace-nowrap border-b border-r px-3 py-1.5 lg:py-2">
                  {student.disciple.encounter_batch?.batchName}
                </TableCell>
                <TableCell className="whitespace-nowrap border-b border-r px-3 py-1.5 lg:py-2">
                  {student.disciple.leader?.name.includes("De Guzman")
                    ? "Ptr. " + student.disciple.leader.name
                    : student.disciple.leader?.name}
                </TableCell>
                {record.processLessonSeries.lessons.map((lesson, i) => (
                  <TableCell
                    key={`process-male-lesson-cell-${lesson.id}`}
                    className="whitespace-nowrap border-b border-r p-px text-center align-baseline last:border-r-0 data-[disabled=true]:pointer-events-none"
                  >
                    <AttendeeDataCell
                      attendee={getAttendee(lesson.id, student.disciple_id)}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </table>
      </div>
    </div>
  )
}

export default ProcessAttendanceDetailPage

function AttendeeDataCell({ attendee }: { attendee?: ProcessAttendee | "NA" }) {
  if (attendee === "NA") return null

  if (!attendee)
    return (
      <div className="grid h-9 gap-px grid-cols-3 grid-rows-1 divide-x text-center text-xs font-semibold">
        <div className="flex items-center justify-center bg-red-400/20 text-red-500">
          A
        </div>
        <div className="flex items-center justify-center bg-red-400/20 text-red-500">
          0
        </div>
        <div className="flex items-center justify-center bg-red-400/20 text-red-500">
          No
        </div>
      </div>
    )

  return (
    <div className="grid h-9 gap-px grid-cols-3 grid-rows-1 divide-x text-center text-xs font-semibold">
      <div className="flex items-center justify-center border-green-500 bg-green-400/20 text-green-500">
        P
      </div>
      <div
        className={cn("flex items-center justify-center", {
          "bg-orange-400/20 text-orange-500":
            attendee.devo <= 2 && attendee.devo > 0,
          "bg-amber-400/20 text-amber-500":
            attendee.devo <= 5 && attendee.devo > 2,
          "bg-green-400/20 text-green-500": attendee.devo >= 6,
        })}
      >
        {attendee.devo}
      </div>
      <div
        className={cn(
          "flex items-center justify-center",
          attendee.with_assignment === true
            ? "bg-green-400/20 text-green-500"
            : "bg-red-400/20 text-red-500"
        )}
      >
        {attendee.with_assignment ? "Yes" : "No"}
      </div>
    </div>
  )
}
