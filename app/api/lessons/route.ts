import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { prisma as db } from "@/lib/db"

import { lessonCreateSchema } from "./schema"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const lessonSeriesList = await db.lessonSeries.findMany({
      include: {
        lessons: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(lessonSeriesList)
  } catch (error: any) {
    return new NextResponse(error.message || "Error", { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    const json = await req.json()

    const body = lessonCreateSchema.parse(json)

    const lesson = await db.lesson.create({
      data: body,
    })

    return NextResponse.json(lesson)
  } catch (error: any) {
    return new NextResponse(error.message || "Error", { status: 500 })
  }
}
