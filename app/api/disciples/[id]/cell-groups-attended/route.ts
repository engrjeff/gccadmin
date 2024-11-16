import { NextResponse } from "next/server"

import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

interface Params {
  params: { id: string }
}

export async function GET(req: Request, { params }: Params) {
  try {
    const attendedCellGroups = await prisma.cellReportAttendees.findMany({
      where: {
        disciple_id: params.id,
      },
      include: {
        cell_report: {
          include: {
            lesson: true,
            assistant: {
              include: {
                disciple: true,
              },
            },
          },
        },
      },
      orderBy: {
        assignedAt: "desc",
      },
    })

    return NextResponse.json(attendedCellGroups)
  } catch (error) {
    console.log("Attended Cell Groups: ", error)
    return NextResponse.json([])
  }
}
