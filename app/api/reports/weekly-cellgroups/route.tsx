import { NextResponse } from "next/server"
import {
  endOfWeek,
  previousMonday,
  previousSunday,
  startOfWeek,
} from "date-fns"

import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const now = new Date()

    const dateFilter = {
      start: startOfWeek(now, { weekStartsOn: 1 }),
      end: endOfWeek(now, { weekStartsOn: 1 }),
    }

    const lastWeekDateFilter = {
      start: previousMonday(dateFilter?.start),
      end: previousSunday(dateFilter?.end),
    }

    const lastWeek = await prisma.cellReport.count({
      where: {
        date: {
          gte: lastWeekDateFilter.start,
          lte: lastWeekDateFilter.end,
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
              select: { disciple: { select: { id: true, name: true } } },
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
