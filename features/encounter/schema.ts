import * as z from "zod"

export const createEncounterBatchSchema = z
  .object({
    batchName: z
      .string({ required_error: "Batch name is required." })
      .min(1, { message: "Batch name is required." }),
    startDate: z
      .string({ required_error: "Start date is required." })
      .regex(/\d{4}-\d{2}-\d{2}/, { message: "Invalid start date" }),
    endDate: z
      .string({ required_error: "End date is required." })
      .regex(/\d{4}-\d{2}-\d{2}/, { message: "Invalid end date" }),
    members: z
      .string()
      .array()
      .min(1, { message: "Must have at least 1 attendee" }),
  })
  .refine(
    ({ startDate, endDate }) =>
      startDate && endDate && new Date(startDate) < new Date(endDate),
    {
      message: "Start date should be before End date",
      path: ["startDate"],
    }
  )

export const updateEncounterBatchSchema = z
  .object({
    batchName: z
      .string({ required_error: "Batch name is required." })
      .min(1, { message: "Batch name is required." }),
    startDate: z
      .string({ required_error: "Start date is required." })
      .regex(/\d{4}-\d{2}-\d{2}/, { message: "Invalid start date" }),
    endDate: z
      .string({ required_error: "End date is required." })
      .regex(/\d{4}-\d{2}-\d{2}/, { message: "Invalid end date" }),
    members: z
      .string()
      .array()
      .min(1, { message: "Must have at least 1 attendee" }),
  })
  .partial()
  .extend({ id: z.string({ required_error: "ID is required." }) })
  .refine(
    ({ startDate, endDate }) =>
      startDate && endDate && new Date(startDate) < new Date(endDate),
    {
      message: "Start date should be before End date",
      path: ["startDate"],
    }
  )

export type CreateEncounterBatchInputs = z.infer<
  typeof createEncounterBatchSchema
>

export type UpdateEncounterBatchInputs = z.infer<
  typeof updateEncounterBatchSchema
>
