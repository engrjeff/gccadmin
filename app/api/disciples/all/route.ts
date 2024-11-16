import { NextResponse } from "next/server"
import { CellStatus, ChurchStatus } from "@prisma/client"

import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const disciples = await prisma.disciple.findMany({
      where: {
        name: {
          not: "GCC Admin",
        },
        isPrimary: false,
        isDeleted: false,
        cell_status: CellStatus.REGULAR,
        church_status: ChurchStatus.REGULAR,
        encounter_batch_id: null,
      },
    })

    return NextResponse.json(disciples)
  } catch (error) {
    return new NextResponse(null, { status: 500 })
  }
}
