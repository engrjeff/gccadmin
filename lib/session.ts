import { getServerSession } from "next-auth/next"

import { authOptions } from "@/lib/auth"

import { prisma as db } from "./db"

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)

  return session?.user
}

export async function getCurrentSession() {
  return await getServerSession(authOptions)
}

export async function verifyUser() {
  const user = await getCurrentUser()

  if (user?.discipleId) return true

  const discipleUser = await db.disciple.findFirst({
    where: {
      userAccountId: user?.id,
    },
  })

  if (discipleUser) return true

  return false
}
