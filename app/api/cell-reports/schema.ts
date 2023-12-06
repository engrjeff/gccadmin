import { CellType } from "@prisma/client"
import { z } from "zod"

export const cellReportCreateSchema = z.object({
  type: z.nativeEnum(CellType, {
    required_error: "Cell type is required",
    invalid_type_error: "Invalid cell type",
  }),
  venue: z.string().min(1, { message: "Venue is required" }),
  date: z
    .string({ required_error: "Date is required" })
    .regex(/\d{4}-\d{2}-\d{2}/, { message: "Invalid date" }),
  time: z.string().regex(/[0-9]{2}:[0-9]{2}/),

  lessonId: z.string().optional(),
  lesson_name: z.string().optional(),
  scripture_references: z.string().array().min(1).optional(),

  assistant_id: z.string().optional(),
  attendees: z.string().array().min(1),

  leaderId: z.string().optional(), // because the leader can be a form input
})

export const cellReportUpdateSchema = cellReportCreateSchema.partial()
