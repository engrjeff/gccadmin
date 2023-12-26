import { z } from "zod"

export const lessonCreateSchema = z.object({
  lesson_series_id: z.string({
    required_error: "Lesson Series ID is required",
  }),
  title: z
    .string({ required_error: "Title is required" })
    .min(1, { message: "Title is required" }),
  description: z.string().optional(),
  scripture_references: z
    .string()
    .array()
    .min(1, { message: "Provide at least 1 verse" }),
  file_url: z
    .string()
    .url({ message: "Provide a valid file URL" })
    .optional()
    .or(z.literal("")),
})

export const lessonUpdateSchema = lessonCreateSchema.partial()

export type LessonCreateInputs = z.infer<typeof lessonCreateSchema>
export type LessonUpdateInputs = z.infer<typeof lessonUpdateSchema>
