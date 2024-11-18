import { redirect } from "next/navigation"
import {
  CellStatus,
  ChurchStatus,
  ProcessLevel,
  ProcessLevelStatus,
} from "@prisma/client"

import { prisma as db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { getSkip } from "@/lib/utils"

import { DisciplesQueryArgs } from "./schema"

const DEFAULT_PAGE_SIZE = 12

export const getDisciples = async (args: DisciplesQueryArgs | undefined) => {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/signin")
  }

  if (!user.discipleId) {
    return {
      disciples: [],
      user,
      pageInfo: {
        total: 0,
        page: 1,
        itemCount: 0,
        pageSize: DEFAULT_PAGE_SIZE,
        totalPages: 0,
      },
    }
  }

  const sortKey = args?.sort ?? "createdAt"
  const sortOrder = (args?.order ?? "desc") as "asc" | "desc"

  const cellStatusFilter = args?.cell_status
    ? (args.cell_status.split(",") as Array<CellStatus>)
    : undefined

  const churchStatusFilter = args?.church_status
    ? (args.church_status.split(",") as Array<ChurchStatus>)
    : undefined

  const processLevelFilter = args?.process_level
    ? (args.process_level.split(",") as Array<ProcessLevel>)
    : undefined

  const processLevelStatusFilter = args?.process_level_status
    ? (args.process_level_status.split(",") as Array<ProcessLevelStatus>)
    : undefined

  const leaderFilter = args?.leaderId ? args.leaderId.split(",") : undefined

  const isActive =
    args?.status === "active"
      ? true
      : args?.status === "inactive"
        ? false
        : true

  const isMyPrimary = args?.status === "primary" ? true : undefined

  const totalFiltered = await db.disciple.count({
    where: {
      leaderId:
        user.role === "ADMIN"
          ? {
              in: leaderFilter,
            }
          : user.discipleId,
      ...{
        isDeleted: false,
        isActive,
        isMyPrimary,
      },
      name: {
        not: "GCC Admin",
        contains: args?.q,
        mode: "insensitive",
      },
      cell_status: {
        in: cellStatusFilter,
      },
      church_status: {
        in: churchStatusFilter,
      },
      process_level: {
        in: processLevelFilter,
      },
      process_level_status: {
        in: processLevelStatusFilter,
      },
    },
  })

  const pageInfo = {
    total: totalFiltered,
    page: !isNaN(args?.page!) ? Number(args?.page) : 1,
    pageSize: DEFAULT_PAGE_SIZE,
  }

  if (user.role === "ADMIN") {
    const a = await db.disciple.findMany({
      where: {
        leaderId: {
          in: leaderFilter,
        },
        ...{
          isDeleted: false,
          isActive,
          isMyPrimary,
        },
        name: {
          not: "GCC Admin",
          contains: args?.q,
          mode: "insensitive",
        },
        cell_status: {
          in: cellStatusFilter,
        },
        church_status: {
          in: churchStatusFilter,
        },
        process_level: {
          in: processLevelFilter,
        },
        process_level_status: {
          in: processLevelStatusFilter,
        },
      },
      include: {
        leader: {
          select: {
            name: true,
          },
        },
      },

      take: args?.pageSize ?? DEFAULT_PAGE_SIZE,
      skip: getSkip({ limit: DEFAULT_PAGE_SIZE, page: args?.page }),
      orderBy:
        sortKey === "leaderName"
          ? {
              leader: {
                name: sortOrder,
              },
            }
          : {
              [sortKey]: sortOrder,
            },
    })

    return {
      disciples: a,
      user,
      pageInfo: {
        ...pageInfo,
        itemCount: a.length,
        totalPages: Math.ceil(totalFiltered / DEFAULT_PAGE_SIZE),
      },
    }
  }

  const disciples = await db.disciple.findMany({
    where: {
      leaderId: user.discipleId,
      ...{
        isDeleted: false,
        isActive,
        isMyPrimary,
      },
      name: {
        contains: args?.q,
        mode: "insensitive",
      },
      cell_status: {
        in: cellStatusFilter,
      },
      church_status: {
        in: churchStatusFilter,
      },
      process_level: {
        in: processLevelFilter,
      },
      process_level_status: {
        in: processLevelStatusFilter,
      },
    },
    include: {
      leader: {
        select: {
          name: true,
        },
      },
    },

    take: args?.pageSize ?? DEFAULT_PAGE_SIZE,
    skip: getSkip({ limit: DEFAULT_PAGE_SIZE, page: args?.page }),

    orderBy:
      sortKey === "leaderName"
        ? {
            leader: {
              name: sortOrder,
            },
          }
        : {
            [sortKey]: sortOrder,
          },
  })

  return {
    disciples,
    user,
    pageInfo: {
      ...pageInfo,
      itemCount: disciples.length,
      totalPages: Math.ceil(totalFiltered / DEFAULT_PAGE_SIZE),
    },
  }
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
