import { NextResponse } from "next/server"

import { prisma as db } from "@/lib/db"
import {
  getCellStatusText,
  getChurchStatusText,
  getMemberTypeText,
  getProcessLevelText,
} from "@/lib/utils"

export async function GET(request: Request) {
  try {
    const rawMemberTypeData = await db.disciple.groupBy({
      by: ["member_type"],
      where: {
        isActive: true,
        isDeleted: false,
        name: {
          not: "GCC Admin",
        },
      },
      _count: {
        member_type: true,
      },
      orderBy: {
        _count: {
          member_type: "desc",
        },
      },
    })

    const rawChurchData = await db.disciple.groupBy({
      by: ["church_status"],
      where: {
        isActive: true,
        isDeleted: false,
        name: {
          not: "GCC Admin",
        },
      },
      _count: {
        church_status: true,
      },
      orderBy: {
        _count: {
          church_status: "desc",
        },
      },
    })

    const rawCellData = await db.disciple.groupBy({
      by: ["cell_status"],
      where: {
        isActive: true,
        isDeleted: false,
        name: {
          not: "GCC Admin",
        },
      },
      _count: {
        cell_status: true,
      },
      orderBy: {
        _count: {
          cell_status: "desc",
        },
      },
    })

    const rawProcessData = await db.disciple.groupBy({
      by: ["process_level"],
      where: {
        isActive: true,
        isDeleted: false,
        name: {
          not: "GCC Admin",
        },
      },
      _count: {
        process_level: true,
      },
      orderBy: {
        _count: {
          process_level: "desc",
        },
      },
    })

    const memberTypeData = rawMemberTypeData.map((i) => ({
      value: i._count.member_type,
      name: getMemberTypeText(i.member_type).name,
      valueDesc: getMemberTypeText(i.member_type).desc,
    }))

    const churchData = rawChurchData.map((i) => ({
      value: i._count.church_status,
      name: i.church_status,
      valueDesc: getChurchStatusText(i.church_status),
    }))

    const cellData = rawCellData.map((i) => ({
      value: i._count.cell_status,
      name: i.cell_status.split("_").join(" "),
      valueDesc: getCellStatusText(i.cell_status),
    }))

    const processData = rawProcessData.map((i) => ({
      value: i._count.process_level,
      name: i.process_level.split("_").join(" "),
      valueDesc: getProcessLevelText(i.process_level),
    }))

    const data = {
      churchData,
      cellData,
      processData,
      memberTypeData,
    }

    return NextResponse.json({ status: "success", data })
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", error: error.message },
      { status: 500 }
    )
  }
}
