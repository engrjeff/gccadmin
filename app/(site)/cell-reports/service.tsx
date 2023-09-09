import { notFound, redirect } from "next/navigation"
import { addDays } from "date-fns"
import nextSaturday from "date-fns/nextSaturday"
import previousSunday from "date-fns/previousSunday"

import { prisma as db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

interface GetCellReportsOptions {
  from: string
  to: string
}

export const getCellReports = async ({ from, to }: GetCellReportsOptions) => {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/signin")
  }

  const firstDay = previousSunday(new Date())
  const lastDay = addDays(firstDay, 6)

  const cellReports = await db.cellReport.findMany({
    where: {
      leaderId: user.role === "ADMIN" ? undefined : user.discipleId,
      date: {
        gte: from ? from : firstDay,
        lte: to ? to : lastDay,
      },
    },
    include: {
      assistant: true,
      attendees: true,
      lesson: true,
      leader: true,
    },
    orderBy: {
      date: "desc",
    },
  })

  return cellReports
}

export const getCellReportById = async (id: string) => {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/signin")
  }

  const cellReport = await db.cellReport.findFirst({
    where: {
      id,
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
        orderBy: {
          disciple: {
            process_level: "asc",
          },
        },
      },
      lesson: true,
      leader: true,
    },
  })

  if (!cellReport) return notFound()

  return cellReport
}

export const getWeeklyReports = async () => {
  const startDay = previousSunday(new Date())
  const endDay = nextSaturday(new Date())

  const reports = await db.cellReport.findMany({
    where: {
      date: {
        gte: startDay,
        lte: endDay,
      },
    },

    include: {
      leader: true,
      assistant: true,
      attendees: {
        select: {
          disciple: true,
        },
      },
    },
  })

  return reports
}
