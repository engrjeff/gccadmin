import { NextResponse } from "next/server"

import { prisma as db } from "@/lib/db"

export async function GET() {
  try {
    const primaryLeaders = await db.disciple.findMany({
      where: {
        isPrimary: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json(primaryLeaders)
  } catch (error) {
    return new NextResponse(null, { status: 500 })
  }
}
