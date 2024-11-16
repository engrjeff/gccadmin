"use server"

import { revalidatePath } from "next/cache"
import * as z from "zod"

import { prisma } from "@/lib/db"
import { authActionClient } from "@/lib/safe-action"

import {
  discipleBulkUpdateSchema,
  discipleCreateSchema,
  discipleUpdateSchema,
} from "./schema"

export const addDisciple = authActionClient
  .metadata({ actionName: "addDisciple" })
  .schema(discipleCreateSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const disciple = await prisma.disciple.create({
      data: {
        ...parsedInput,
        birthdate: new Date(parsedInput.birthdate),
        leaderId: parsedInput.leaderId ? parsedInput.leaderId : user.discipleId,
      },
      select: {
        id: true,
      },
    })

    revalidatePath("/disciples")

    return {
      disciple,
    }
  })

export const updateDisciple = authActionClient
  .metadata({ actionName: "updateDisciple" })
  .schema(discipleUpdateSchema.extend({ id: z.string() }))
  .action(async ({ parsedInput: { id, ...data }, ctx: { user } }) => {
    const disciple = await prisma.disciple.update({
      where: {
        id,
      },
      data: {
        ...data,
        birthdate: data.birthdate ? new Date(data.birthdate) : undefined,
        leaderId: data.leaderId ? data.leaderId : undefined,
      },

      select: {
        id: true,
        userAccountId: true,
      },
    })

    // if assigning a userAccount, update that account : isAlreadyLinked = true
    if (data.userAccountId) {
      await prisma.user.update({
        where: {
          id: data.userAccountId,
        },
        data: {
          isAlreadyLinked: true,
        },
      })
    }

    revalidatePath("/disciples")

    return {
      disciple,
    }
  })

export const deleteDisciple = authActionClient
  .metadata({ actionName: "deleteDisciple" })
  .schema(
    z.object({ id: z.string({ required_error: "Disciple ID is required." }) })
  )
  .action(async ({ parsedInput: { id } }) => {
    await prisma.disciple.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
        isActive: false,
      },
    })

    revalidatePath("/disciples")

    return {
      status: "ok",
    }
  })

export const bulkUpdateDisciple = authActionClient
  .metadata({ actionName: "bulkUpdateDisciple" })
  .schema(discipleBulkUpdateSchema)
  .action(async ({ parsedInput: data }) => {
    const updatedDisciples = await prisma.disciple.updateMany({
      where: {
        id: {
          in: data.selectedIds,
        },
      },
      data: {
        cell_status: data.cell_status,
        church_status: data.church_status,
        process_level: data.process_level,
        process_level_status: data.process_level_status,
        isActive: data.isActive,
      },
    })

    revalidatePath("/disciples")

    return {
      updated: updatedDisciples.count,
    }
  })
