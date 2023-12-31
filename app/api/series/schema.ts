import { z } from "zod"

export const seriesCreateSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(1, { message: "Title is required" }),
  description: z.string().optional(),
  tags: z.string().array().min(1, { message: "Provide at least 1 tag" }),
})

export const seriesUpdateSchema = seriesCreateSchema.partial()

export type LessonSeriesCreateInputs = z.infer<typeof seriesCreateSchema>
export type LessonSeriesUpdateInputs = z.infer<typeof seriesUpdateSchema>
