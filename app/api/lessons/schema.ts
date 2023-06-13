import { z } from "zod"

export const lessonCreateSchema = z.object({
  lesson_series_id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  scripture_references: z.string().array().min(1),
})

export const lessonUpdateSchema = lessonCreateSchema.partial()
