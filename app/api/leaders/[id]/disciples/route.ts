import { NextResponse } from "next/server"

import { prisma as db } from "@/lib/db"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const disciplesOfLeader = await db.disciple.findMany({
      where: {
        isActive: true,
        leaderId: params.id,
      },
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json(disciplesOfLeader)
  } catch (error) {
    return new NextResponse(null, { status: 500 })
  }
}
