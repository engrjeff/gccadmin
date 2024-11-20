import { NextResponse } from "next/server"
import { endOfWeek, startOfWeek } from "date-fns"

import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const now = new Date()

    const dateFilter = {
      start: startOfWeek(now, { weekStartsOn: 1 }),
      end: endOfWeek(now, { weekStartsOn: 1 }),
    }

    const cellreports = await prisma.disciple.findMany({
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
            assistant: {
              select: { disciple: { select: { id: true, name: true } } },
            },
          },
        },
      },
    })

    return NextResponse.json(cellreports)
  } catch (error) {
    return NextResponse.json(null)
  }
}
