import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action"
import * as z from "zod"

import { getCurrentUser } from "./session"

class ActionError extends Error {}

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    console.error("Action error:", e.message)

    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        if (
          e.message.includes(
            "Unique constraint failed on the fields: (`batchName`)"
          )
        ) {
          return "Encounter batch name must be unique."
        }
      }
    }

    if (e instanceof ActionError) {
      return e.message
    }

    if (e instanceof Error) {
      return e.message
    }

    return DEFAULT_SERVER_ERROR_MESSAGE
  },
  defineMetadataSchema() {
    return z.object({
      actionName: z.string(),
    })
  },
  // Define logging middleware.
})

export const authActionClient = actionClient.use(async ({ next }) => {
  const user = await getCurrentUser()

  if (!user) throw new Error("Session not found.")

  return next({ ctx: { user } })
})
