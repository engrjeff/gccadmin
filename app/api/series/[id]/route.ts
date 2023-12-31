import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { prisma as db } from "@/lib/db"

import { seriesCreateSchema } from "../schema"

interface Params {
  params: { id: string }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    const json = await req.json()

    const body = seriesCreateSchema.parse(json)

    const lessonSeries = await db.lessonSeries.update({
      where: {
        id: params.id,
      },
      data: body,
    })

    return NextResponse.json(lessonSeries)
  } catch (error: any) {
    return new NextResponse(error.message || "Error", { status: 500 })
  }
}
