import { Gender, MemberType, ProcessLevel } from "@prisma/client"
import { z } from "zod"

export const discipleCreateSchema = z.object({
  name: z.string(),
  address: z.string(),
  birthdate: z.string().datetime(),
  gender: z.nativeEnum(Gender),
  member_type: z.nativeEnum(MemberType),
  process_level: z.nativeEnum(ProcessLevel),
  leaderId: z.string().optional(),
})

export const discipleUpdateSchema = discipleCreateSchema.partial().extend({
  userAccountId: z.string().optional(),
  isActive: z.boolean().optional(),
  isMyPrimary: z.boolean().optional(),
})
