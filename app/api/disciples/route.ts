import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { prisma as db } from "@/lib/db"

import { discipleBulkUpdateSchema, discipleCreateSchema } from "./schema"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    const { user } = session

    const disciples = await db.disciple.findMany({
      where: {
        leaderId: user.id,
      },
    })

    return NextResponse.json(disciples)
  } catch (error) {
    return new NextResponse(null, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    const json = await req.json()

    const body = discipleCreateSchema.parse(json)

    const disciple = await db.disciple.create({
      data: {
        ...body,
        leaderId: body.leaderId ? body.leaderId : session.user.discipleId,
      },
      select: {
        id: true,
      },
    })

    return NextResponse.json(disciple)
  } catch (error: any) {
    return new NextResponse(error.message || "Error", { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    const json = await req.json()

    const body = discipleBulkUpdateSchema.parse(json)

    const updatedDisciples = await db.disciple.updateMany({
      where: {
        id: {
          in: body.selectedIds,
        },
      },
      data: {
        cell_status: body.cell_status,
        church_status: body.church_status,
        process_level: body.process_level,
      },
    })

    return NextResponse.json(updatedDisciples)
  } catch (error: any) {
    return new NextResponse(error.message || "Error", { status: 500 })
  }
}
