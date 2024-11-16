import { NextRequest, NextResponse } from "next/server"
import { CellStatus, ChurchStatus, ProcessLevel } from "@prisma/client"

import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams

    const disciples = await prisma.disciple.findMany({
      where: {
        name: {
          not: "GCC Admin",
        },
        isPrimary: false,
        isDeleted: false,
        cell_status: CellStatus.REGULAR,
        church_status: ChurchStatus.REGULAR,
        process_level:
          (params.get("processLevel") as ProcessLevel) ?? undefined,
        encounter_batch_id:
          params.get("withBatch") === "true" ? undefined : null,
      },
    })

    return NextResponse.json(disciples)
  } catch (error) {
    return new NextResponse(null, { status: 500 })
  }
}
