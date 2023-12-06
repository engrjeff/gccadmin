import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { prisma as db } from "@/lib/db"

import { discipleUpdateSchema } from "../schema"

export const dynamic = "force-dynamic"

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

    const body = discipleUpdateSchema.parse(json)

    const disciple = await db.disciple.update({
      where: {
        id: params.id,
      },
      data: {
        ...body,
        leaderId: body.leaderId ? body.leaderId : undefined,
      },

      select: {
        id: true,
        userAccountId: true,
      },
    })

    // if assigning a userAccount, update that account : isAlreadyLinked = true
    if (body.userAccountId) {
      await db.user.update({
        where: {
          id: body.userAccountId,
        },
        data: {
          isAlreadyLinked: true,
        },
      })
    }

    return NextResponse.json(disciple)
  } catch (error: any) {
    return new NextResponse(error.message || "Error", { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    await db.disciple.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json("success")
  } catch (error: any) {
    return new NextResponse(error.message || "Error", { status: 500 })
  }
}
