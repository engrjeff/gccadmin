import { NextResponse } from "next/server"
import { endOfWeek, startOfWeek } from "date-fns"

import { prisma as db } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const now = new Date()

    const dateFilter = {
      start: startOfWeek(now),
      end: endOfWeek(now),
    }

    const result = await db.disciple.findMany({
      where: {
        isPrimary: true,
      },
      select: {
        id: true,
        name: true,
        cell_reports: {
          where: {
            date: {
              gte: dateFilter.start,
              lte: dateFilter.end,
            },
          },
          select: {
            id: true,
            type: true,
          },
        },
      },
      take: 30,
    })

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(null)
  }
}
