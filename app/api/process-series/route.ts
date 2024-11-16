import { NextResponse } from "next/server"

import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const processSeriesList = await prisma.processLessonSeries.findMany()

    return NextResponse.json(processSeriesList)
  } catch (error) {
    return NextResponse.json([])
  }
}
