import { redirect } from "next/navigation"

import { prisma as db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

interface GetDisciplesArgs {
  isActive?: string
  page?: number
  pageSize?: number
}

export const getDisciples = async (args: GetDisciplesArgs | undefined) => {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/signin")
  }

  if (!user.discipleId) {
    return { disciples: [], user }
  }

  const totalDisciples = await db.disciple.count({ where: { isActive: true } })

  const disciples = await db.disciple.findMany({
    where: {
      leaderId: user.role === "ADMIN" ? undefined : user.discipleId,
      ...{ isActive: args?.isActive === "false" ? false : true },
      name: {
        not: "GCC Admin",
      },
    },
    include: {
      leader: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return { disciples, user }
}

export const getDiscipleById = async (id: string) => {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/signin")
  }

  const disciple = await db.disciple.findFirst({
    where: {
      id,
    },
    include: {
      leader: true,
    },
  })

  if (!disciple) {
    return null
  }

  return disciple
}

export const getUserAccounts = async () => {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/signin")
  }

  const users = await db.user.findMany({
    where: {
      id: {
        not: user.id,
      },
      isAlreadyLinked: false,
    },
  })

  return users
}

export const getPrimaryLeaders = async () => {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/signin")
  }

  const primarLeaders = await db.disciple.findMany({
    where: {
      isPrimary: true,
    },
    orderBy: {
      name: "asc",
    },
  })

  return primarLeaders
}
