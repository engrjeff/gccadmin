import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { prisma as db } from "@/lib/db"

import { lessonCreateSchema } from "./schema"

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
