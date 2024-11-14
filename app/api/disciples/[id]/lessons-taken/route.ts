import { NextResponse } from "next/server"

import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

interface Params {
  params: { id: string }
}

export async function GET(req: Request, { params }: Params) {
  try {
    const lessonsTaken = await prisma.lessonsTakenByDisciple.findMany({
      where: {
        disciple_id: params.id,
      },
      include: {
        lesson: true,
      },
      orderBy: {
        assignedAt: "desc",
      },
    })

    return NextResponse.json(lessonsTaken)
  } catch (error) {
    console.log("Lessons Taken: ", error)
    return NextResponse.json([])
  }
}
