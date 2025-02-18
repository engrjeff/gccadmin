import {
  CellStatus,
  ChurchStatus,
  Gender,
  MemberType,
  ProcessLevel,
  ProcessLevelStatus,
} from "@prisma/client"
import { z } from "zod"

export const discipleCreateSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  birthdate: z
    .string({ required_error: "Birthdate is required" })
    .regex(/\d{4}-\d{2}-\d{2}/, { message: "Invalid birthdate" }),
  gender: z.nativeEnum(Gender),
  cell_status: z.nativeEnum(CellStatus),
  church_status: z.nativeEnum(ChurchStatus),
  member_type: z.nativeEnum(MemberType),
  process_level: z.nativeEnum(ProcessLevel),
  process_level_status: z.nativeEnum(ProcessLevelStatus),
  leaderId: z.string().min(1, { message: "Leader is required" }),
})

export const discipleUpdateSchema = discipleCreateSchema.partial().extend({
  userAccountId: z.string().optional(),
  isActive: z.boolean().optional(),
  isMyPrimary: z.boolean().optional(),
})

export const discipleBulkUpdateSchema = z.object({
  selectedIds: z.string().array(),
  cell_status: z.nativeEnum(CellStatus).optional(),
  church_status: z.nativeEnum(ChurchStatus).optional(),
  process_level: z.nativeEnum(ProcessLevel).optional(),
})

export type DiscipleCreateInputs = z.infer<typeof discipleCreateSchema>
export type DiscipleUpdateInputs = z.infer<typeof discipleUpdateSchema>

export const bulkDiscipleCreateSchema = z.object({
  leaderId: z
    .string({ required_error: "Leader is required" })
    .min(1, { message: "Leader is required" }),
  disciples: z.array(discipleCreateSchema.omit({ leaderId: true })),
})

export type BulkDiscipleCreateInputs = z.infer<typeof bulkDiscipleCreateSchema>
