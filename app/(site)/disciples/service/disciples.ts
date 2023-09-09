import { notFound, redirect } from "next/navigation"

import { prisma as db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

interface GetDisciplesArgs {
  isActive?: string
}

export const getDisciples = async ({ isActive }: GetDisciplesArgs) => {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/signin")
  }

  if (!user.discipleId) {
    return { disciples: [], user }
  }

  const disciples = await db.disciple.findMany({
    where: {
      leaderId: user.role === "ADMIN" ? undefined : user.discipleId,
      isActive: !isActive ? true : isActive === "true" ? true : false,
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
      name: "asc",
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
      lessons_taken: {
        include: {
          lesson: true,
        },
      },
      attended_cell_reports: {
        include: {
          cell_report: {
            include: {
              lesson: true,
            },
          },
        },
      },
    },
  })

  if (!disciple) {
    return notFound()
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
