import { NextRequest, NextResponse } from "next/server"
import {
  endOfWeek,
  previousMonday,
  previousSunday,
  startOfWeek,
} from "date-fns"

import { prisma } from "@/lib/db"
import { calcPercentDiff, getDateRange } from "@/lib/utils"

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

    const lastRecords = await prisma.cellReport.count({
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
            attendees: {
              select: {
                disciple: {
                  select: {
                    id: true,
                    name: true,
                    cell_status: true,
                    church_status: true,
                    process_level: true,
                  },
                },
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

    const totalCGs = cellReports.reduce((t, c) => t + c.cell_reports.length, 0)

    return NextResponse.json({
      cellReports,
      trend: {
        value: calcPercentDiff(totalCGs, lastRecords),
        // lastRecords === 0
        //   ? 100
        //   : (Math.abs(cellReports.length - lastRecords) / lastRecords) * 100,
        status: cellReports.length >= lastRecords ? "increased" : "decreased",
      },
    })
  } catch (error) {
    return NextResponse.json(null)
  }
}
