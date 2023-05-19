import { CellType } from "@prisma/client"
import { z } from "zod"

export const cellReportCreateSchema = z.object({
  type: z.nativeEnum(CellType),
  venue: z.string(),
  date: z.string().datetime(),
  time: z.string(),

  lessonId: z.string().optional(),
  lesson_name: z.string().optional(),
  scripture_references: z.string().array().min(1).optional(),

  assistant_id: z.string().optional(),
  attendees: z.string().array().min(1),

  leaderId: z.string().optional(), // because the leader can be a form input
})

export const cellReportUpdateSchema = cellReportCreateSchema.partial()
