import { notFound } from "next/navigation"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { prisma as db } from "@/lib/db"

interface Params {
  params: { id: string }
}

export async function GET(request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    const cellReport = await db.cellReport.findFirst({
      where: {
        id: params.id,
      },
      include: {
        leader: true,
        lesson: true,
        assistant: {
          include: { disciple: true },
        },
        attendees: { include: { disciple: true } },
      },
    })

    if (!cellReport) return notFound()

    return NextResponse.json(cellReport)
  } catch (error: any) {
    return new NextResponse(error.message || "Error", { status: 500 })
  }
}
