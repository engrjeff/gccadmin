"use server"

import { revalidatePath } from "next/cache"
import { ProcessLevelStatus } from "@prisma/client"

import { prisma } from "@/lib/db"
import { authActionClient } from "@/lib/safe-action"

import {
  createAttendancePeriodSchema,
  createAttendanceRecordSchema,
} from "./schema"

export const createAttendancePeriod = authActionClient
  .metadata({ actionName: "createAttendancePeriod" })
  .schema(createAttendancePeriodSchema)
  .action(async ({ parsedInput: { students, ...data }, ctx: { user } }) => {
    const period = await prisma.processAttendancePeriod.create({
      data: {
        ...data,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      },
      select: { id: true },
    })

    // students
    const createdStudents =
      await prisma.processAttendancePeriodStudent.createMany({
        data: students.map((student) => {
          return {
            assignedBy: user.discipleId!,
            disciple_id: student,
            process_attendance_period_id: period.id,
            process_attendance_period_student_id: `${period.id}-${student}`,
          }
        }),
      })

    // the student's process level should also be updated accordingly
    await prisma.disciple.updateMany({
      where: {
        id: {
          in: students,
        },
      },
      data: {
        process_level: data.processLevel,
        process_level_status: ProcessLevelStatus.ON_GOING,
      },
    })

    revalidatePath("/process-attendance")

    return {
      period,
    }
  })

export const createAttendance = authActionClient
  .metadata({ actionName: "createAttendance" })
  .schema(createAttendanceRecordSchema)
  .action(
    async ({ parsedInput: { process_attendees, ...data }, ctx: { user } }) => {
      const attendance = await prisma.processAttendance.create({
        data: {
          ...data,
          date: new Date(data.date),
        },
        select: { id: true },
      })

      // create ProcessAttendee records
      await prisma.processAttendee.createMany({
        data: process_attendees.map((p) => ({
          disciple_id: p.disciple_id,
          process_attendance_attendee_id: `${attendance.id}-${p.disciple_id}`,
          process_attendance_id: attendance.id,
          is_present: true,
          devo: p.devo,
          with_assignment: p.with_assignment,
          remarks: p.remarks,
        })),
      })

      revalidatePath(`/process-attendance/${data.processAttendancePeriodId}`)

      return {
        attendance,
      }
    }
  )
