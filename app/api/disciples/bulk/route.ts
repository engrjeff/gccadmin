import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { prisma as db } from "@/lib/db"

import { bulkDiscipleCreateSchema } from "../schema"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    const body = await request.json()

    const validation = bulkDiscipleCreateSchema.safeParse(body)

    if (!validation.success) {
      const error = validation.error.format()

      return NextResponse.json(error, { status: 400 })
    }

    const createdDisciples = await db.disciple.createMany({
      data: validation.data.disciples.map((disciple) => ({
        ...disciple,
        birthdate: new Date(disciple.birthdate),
        leaderId: validation.data.leaderId,
      })),
      skipDuplicates: true,
    })

    return NextResponse.json({
      data: createdDisciples,
      count: createdDisciples.count,
    })
  } catch (error: any) {
    return new NextResponse(error.message || "Error", { status: 500 })
  }
}
