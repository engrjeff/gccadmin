import { redirect } from "next/navigation"
import { CellType } from "@prisma/client"
import {
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
} from "date-fns"

import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { getSkip } from "@/lib/utils"

import { CellReportQueryArgs } from "./schema"

const DEFAULT_PAGE_SIZE = 12

export async function getCellReports(args: CellReportQueryArgs | undefined) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/signin")
  }

  if (!user.discipleId) {
    return {
      cellReports: [],
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

  const sortKey = args?.sort ?? "date"
  const sortOrder = (args?.order ?? "desc") as "asc" | "desc"

  const cellTypeFilter = args?.type ? (args.type as CellType) : undefined

  const leaderFilter = args?.leaderId ? args.leaderId.split(",") : undefined

  const dateFilter = args?.dateRange ? getDateRange(args.dateRange) : undefined

  const totalFiltered = await prisma.cellReport.count({
    where: {
      leaderId: user.role === "ADMIN" ? undefined : user.discipleId,
      type: cellTypeFilter,
      date: {
        gte: dateFilter?.start,
        lte: dateFilter?.end,
      },
    },
  })

  const cellReports = await prisma.cellReport.findMany({
    where: {
      leaderId: user.role === "ADMIN" ? { in: leaderFilter } : user.discipleId,
      type: cellTypeFilter,
      date: {
        gte: dateFilter?.start,
        lte: dateFilter?.end,
      },
    },
    include: {
      assistant: {
        include: {
          disciple: true,
        },
      },
      attendees: {
        include: {
          disciple: true,
        },
      },
      lesson: true,
      leader: true,
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

  const pageInfo = {
    total: totalFiltered,
    page: !isNaN(args?.page!) ? Number(args?.page) : 1,
    pageSize: DEFAULT_PAGE_SIZE,
  }

  return {
    cellReports,
    user,
    pageInfo: {
      ...pageInfo,
      itemCount: cellReports.length,
      totalPages: Math.ceil(totalFiltered / DEFAULT_PAGE_SIZE),
    },
  }
}

function getDateRange(
  preset: CellReportQueryArgs["dateRange"]
): { start: Date; end: Date } | undefined {
  if (!preset) return undefined

  const now = new Date()

  if (preset === "this_week") {
    return {
      start: startOfWeek(now, { weekStartsOn: 1 }),
      end: endOfWeek(now, { weekStartsOn: 1 }),
    }
  }

  if (preset === "last_week") {
    return {
      start: subDays(startOfWeek(now, { weekStartsOn: 1 }), 7),
      end: subDays(endOfWeek(now, { weekStartsOn: 1 }), 7),
    }
  }

  if (preset === "this_month") {
    return {
      start: startOfMonth(now),
      end: endOfMonth(now),
    }
  }

  if (preset === "last_month") {
    return {
      start: startOfMonth(subMonths(now, 1)),
      end: endOfMonth(subMonths(now, 1)),
    }
  }
}
