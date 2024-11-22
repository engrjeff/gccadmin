import { NextResponse } from "next/server"

import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

interface Params {
  params: { id: string }
}

export async function GET(req: Request, { params }: Params) {
  try {
    const disciple = await prisma.disciple.findUnique({
      where: {
        id: params.id,
      },
      include: {
        handled_disciples: {
          select: {
            id: true,
            name: true,
            isActive: true,
          },
        },
      },
    })

    return NextResponse.json(disciple)
  } catch (error) {
    console.log("Handled Disciples: ", error)
    return NextResponse.json([])
  }
}
