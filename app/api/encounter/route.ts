import { NextResponse } from "next/server"

import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const results = await prisma.encounterBatch.findMany({
      include: {
        members: true,
      },
      orderBy: {
        endDate: "desc",
      },
    })

    return NextResponse.json(results)
  } catch (error) {
    return NextResponse.json([])
  }
}
