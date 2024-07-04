import { NextResponse } from "next/server"
import { addDays, isWithinInterval, previousSunday } from "date-fns"

import { prisma as db } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const now = new Date()

    now.setHours(0, 0, 0, 0)
    const startDate = previousSunday(now)
    const endDate = addDays(startDate, 6)

    const disciples = await db.disciple.findMany({
      where: {
        isActive: true,
        isDeleted: false,
        name: {
          not: "GCC Admin",
        },
      },
    })

    const totalDisciples = disciples.length

    const activeInChurch = disciples.filter(
      (d) => d.church_status === "REGULAR"
    ).length

    const activeInCell = disciples.filter(
      (d) => d.cell_status === "REGULAR"
    ).length

    const disciplesInProcess = disciples.filter(
      (d) => d.process_level !== "NONE"
    ).length

    const cgThisWeek = await db.cellReport.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        attendees: {
          include: {
            disciple: true,
          },
        },
      },
    })

    const newSouls = cgThisWeek.reduce((total, cg) => {
      const attendess = cg.attendees.filter(
        (a) =>
          isWithinInterval(a.disciple.createdAt, {
            start: startDate,
            end: endDate,
          }) && a.disciple.cell_status === "FIRST_TIMER"
      )

      return total + attendess.length
    }, 0)

    const kpiData = {
      totalDisciples,
      activeInChurch,
      activeInCell,
      disciplesInProcess,
      newlyWonSouls: newSouls,
    }

    return NextResponse.json({ status: "success", data: kpiData })
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", error: error.message },
      { status: 500 }
    )
  }
}
