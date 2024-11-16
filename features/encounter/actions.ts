"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/db"
import { authActionClient } from "@/lib/safe-action"

import {
  createEncounterBatchSchema,
  updateEncounterBatchSchema,
} from "./schema"

export const createEncounterBatch = authActionClient
  .metadata({ actionName: "createEncounterBatch" })
  .schema(createEncounterBatchSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const batch = await prisma.encounterBatch.create({
      data: {
        batchName: parsedInput.batchName,
        startDate: new Date(parsedInput.startDate),
        endDate: new Date(parsedInput.endDate),
        members: {
          connect: parsedInput.members.map((m) => ({ id: m })),
        },
      },
    })

    revalidatePath("/encounter")

    return {
      batch,
    }
  })

export const updateEncounterBatch = authActionClient
  .metadata({ actionName: "updateEncounterBatch" })
  .schema(updateEncounterBatchSchema)
  .action(async ({ parsedInput: { id, ...data }, ctx: { user } }) => {
    const foundBatch = await prisma.encounterBatch.findUnique({
      where: { id },
      include: { members: true },
    })

    if (!foundBatch) throw new Error("Cannot find Encounter Batch.")

    const currentMembers = foundBatch.members.map((c) => c.id)

    const toConnect = data.members?.filter((c) => !currentMembers?.includes(c))

    const toDisconnect = currentMembers?.filter(
      (c) => !data.members?.includes(c)
    )
    const batch = await prisma.encounterBatch.update({
      where: {
        id,
      },
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        members: {
          connect: toConnect?.map((m) => ({ id: m })),
          disconnect: toDisconnect?.map((m) => ({ id: m })),
        },
      },
    })

    revalidatePath("/encounter")

    return {
      batch,
    }
  })
