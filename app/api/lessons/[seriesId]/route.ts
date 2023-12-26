import { NextResponse } from "next/server"

import { prisma as db } from "@/lib/db"

interface Params {
  params: { seriesId: string }
}

export async function GET(req: Request, { params }: Params) {
  try {
    const lessonSeries = await db.lessonSeries.findFirst({
      where: {
        id: params.seriesId,
      },
      include: {
        lessons: true,
      },
    })

    return NextResponse.json(lessonSeries)
  } catch (error: any) {
    return new NextResponse(error.message || "Error", { status: 500 })
  }
}
