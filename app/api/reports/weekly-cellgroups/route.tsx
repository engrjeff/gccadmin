import { NextRequest, NextResponse } from "next/server"
import {
  endOfWeek,
  previousMonday,
  previousSunday,
  startOfWeek,
} from "date-fns"

import { prisma } from "@/lib/db"
import { getDateRange } from "@/lib/utils"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const view = searchParams.get("view")

    const now = new Date()

    let dateFilter = {
      start: startOfWeek(now, { weekStartsOn: 1 }),
      end: endOfWeek(now, { weekStartsOn: 1 }),
    }

    let lastDateFilter = {
      start: previousMonday(dateFilter?.start),
      end: previousSunday(dateFilter?.end),
    }

    if (view === "monthly") {
      dateFilter = getDateRange("this_month")!
      lastDateFilter = getDateRange("last_month")!
    }

    const lastWeek = await prisma.cellReport.count({
      where: {
        date: {
          gte: lastDateFilter.start,
          lte: lastDateFilter.end,
        },
      },
    })

    const cellReports = await prisma.disciple.findMany({
      where: {
        isPrimary: true,
      },
      select: {
        id: true,
        name: true,
        cell_reports: {
          where: {
            date: {
              gte: dateFilter?.start,
              lte: dateFilter?.end,
            },
          },
          include: {
            _count: {
              select: {
                attendees: true,
              },
            },
            assistant: {
              select: {
                disciple: {
                  include: {
                    leader: { select: { name: true } },
                    handled_by: { select: { name: true } },
                  },
                },
              },
            },
          },
        },
      },
    })

    return NextResponse.json({
      cellReports,
      trend: {
        value:
          lastWeek === 0
            ? 100
            : (Math.abs(cellReports.length - lastWeek) / lastWeek) * 100,
        status: cellReports.length >= lastWeek ? "increased" : "decreased",
      },
    })
  } catch (error) {
    return NextResponse.json(null)
  }
}
