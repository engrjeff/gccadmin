import { NextRequest, NextResponse } from "next/server"

import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams

    const requestType = query.get("type")

    // members by category (type),
    if (requestType === "memberType") {
      const result = await prisma.disciple.groupBy({
        by: "member_type",
        _count: {
          member_type: true,
        },
        orderBy: {
          _count: {
            member_type: "desc",
          },
        },
      })

      return NextResponse.json(result)
    }
    // members by status,
    if (requestType === "status") {
      const result = await prisma.disciple.groupBy({
        by: "isActive",
        _count: {
          isActive: true,
        },
        orderBy: {
          _count: {
            isActive: "desc",
          },
        },
      })

      return NextResponse.json(result)
    }
    // members by cell status,
    if (requestType === "cellStatus") {
      const result = await prisma.disciple.groupBy({
        by: "cell_status",
        _count: {
          cell_status: true,
        },
        orderBy: {
          _count: {
            cell_status: "desc",
          },
        },
      })

      return NextResponse.json(result)
    }
    // members by church status
    if (requestType === "churchStatus") {
      const result = await prisma.disciple.groupBy({
        by: "church_status",
        _count: {
          church_status: true,
        },
        orderBy: {
          _count: {
            church_status: "desc",
          },
        },
      })

      return NextResponse.json(result)
    }
  } catch (error) {
    return NextResponse.json(null)
  }
}
