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

  const disciples = await db.disciple.findMany({
    where: {
      leaderId: user.role === "ADMIN" ? undefined : user.discipleId,
      ...{
        isDeleted: false,
        isActive: args?.isActive === "false" ? false : true,
      },
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

  const isAdmin = user.role === "ADMIN"

  const disciple = await db.disciple.findFirst({
    where: {
      id,
      leaderId: isAdmin ? undefined : user.discipleId,
    },
    include: {
      leader: true,
    },
  })

  if (!disciple && !isAdmin) {
    redirect("/dashboard")
  }

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

  const primaryLeaders = await db.disciple.findMany({
    where: {
      isPrimary: true,
    },
    orderBy: {
      name: "asc",
    },
  })

  return primaryLeaders
}

export const getDisciplesByLeader = async (leaderId: string) => {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/signin")
  }

  const disciples = await db.disciple.findMany({
    where: {
      leaderId,
      isDeleted: false,
    },
    include: {
      leader: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: [
      {
        isMyPrimary: "asc",
      },
      {
        name: "asc",
      },
      {
        gender: "desc",
      },
    ],
  })

  if (!disciples) {
    return []
  }

  return disciples
}

export const getLessonsTakenByDisciple = async (discipleId: string) => {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/signin")
  }

  const lessonsTaken = await db.disciple.findFirst({
    where: {
      id: discipleId,
    },
    select: {
      lessons_taken: {
        include: {
          lesson: true,
        },
        orderBy: {
          assignedAt: "desc",
        },
      },
    },
  })

  return lessonsTaken
}

export const getCellgroupsAttendedByDisciple = async (discipleId: string) => {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/signin")
  }

  const attendedCellgroups = await db.disciple.findFirst({
    where: {
      id: discipleId,
    },
    select: {
      attended_cell_reports: {
        include: {
          cell_report: {
            include: { lesson: true },
          },
        },
        orderBy: {
          assignedAt: "desc",
        },
      },
    },
  })

  return attendedCellgroups
}
