import { ProcessLevel } from "@prisma/client"
import * as z from "zod"

const baseSchema = z.object({
  processLevel: z.nativeEnum(ProcessLevel, {
    message: "Invalid process level.",
  }),
  processLessonSeriesId: z
    .string({ required_error: "Process series is required." })
    .min(1, { message: "Process series is required." }),
  description: z
    .string({ required_error: "Description is required." })
    .min(1, { message: "Description is required." }),
  startDate: z
    .string({ required_error: "Start date is required." })
    .regex(/\d{4}-\d{2}-\d{2}/, { message: "Invalid start date." }),
  endDate: z
    .string()
    .regex(/\d{4}-\d{2}-\d{2}/, { message: "Invalid end date." }),
  students: z
    .string()
    .array()
    .min(1, { message: "Must have at least 1 student." }),
})

export const createAttendancePeriodSchema = baseSchema.refine(
  ({ startDate, endDate }) =>
    startDate && endDate && new Date(startDate) < new Date(endDate),
  {
    message: "Start date should be before end date.",
    path: ["startDate"],
  }
)

export const updateAttendancePeriodSchema = baseSchema
  .partial()
  .extend({ id: z.string({ required_error: "ID is required." }) })
  .refine(
    ({ startDate, endDate }) =>
      startDate && endDate && new Date(startDate) < new Date(endDate),
    {
      message: "Start date should be before end date.",
      path: ["startDate"],
    }
  )

export type CreateAttendancePeriodInputs = z.infer<
  typeof createAttendancePeriodSchema
>

export type UpdateAttendancePeriodInputs = z.infer<
  typeof updateAttendancePeriodSchema
>

export const createAttendanceRecordSchema = z.object({
  date: z
    .string({ required_error: "Date is required." })
    .regex(/\d{4}-\d{2}-\d{2}/, { message: "Invalid date." }),
  process_lesson_id: z.string({
    required_error: "Process lesson is required.",
  }),
  teacher_id: z
    .string({ required_error: "Teacher is required." })
    .min(1, { message: "Teacher is required." }),
  processAttendancePeriodId: z.string({
    required_error: "Attendance period is required.",
  }),
  process_attendees: z
    .object({
      disciple_id: z.string(),
      remarks: z.string().optional(),
      devo: z.number().int().positive().min(0),
      with_assignment: z.boolean().optional(),
    })
    .array()
    .min(1, { message: "Must have at least 1 student." }),
})

export type CreateAttendanceRecordInputs = z.infer<
  typeof createAttendanceRecordSchema
>
