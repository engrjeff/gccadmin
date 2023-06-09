import { notFound, redirect } from "next/navigation"
import nextSaturday from "date-fns/nextSaturday"
import previousSunday from "date-fns/previousSunday"

import { prisma as db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

export const getCellReports = async () => {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/signin")
  }

  const cellReports = await db.cellReport.findMany({
    where: {
      leaderId: user.role === "ADMIN" ? undefined : user.discipleId,
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
