import {
  CellStatus,
  ChurchStatus,
  MemberType,
  ProcessLevel,
} from "@prisma/client"
import nextSaturday from "date-fns/nextSaturday"
import previousSunday from "date-fns/previousSunday"

import { prisma as db } from "@/lib/db"

const getWeeklyReports = async (params: { startDate: Date; endDate: Date }) => {
  const reports = await db.disciple.findMany({
    where: {
      isPrimary: true,
    },
    include: {
      disciples: true,
      cell_reports: {
        where: {
          date: {
            gte: params.startDate,
            lte: params.endDate,
          },
        },
        include: {
          leader: true,
          assistant: true,
          attendees: {
            select: {
              disciple: true,
            },
          },
        },
      },
    },
  })

  const totalCGsDone = reports.reduce(
    (total, entry) => total + entry.cell_reports.length,
    0
  )

  const cgCountByLeaderData = [
    ...reports.map((r) => ({
      id: r.id,
      name: r.name,
      cgCount: r.cell_reports.length,
      uniqueDisciplesDuringCgCount: new Set(
        r.cell_reports.map((c) => c.attendees).flat()
      ).size,
    })),
  ].sort((a, b) => {
    if (a.cgCount > b.cgCount) return -1
    if (a.cgCount < b.cgCount) return 1
    return 0
  })

  return { totalCGsDone, cgCountByLeaderData, leaders: reports }
}

export const getDashboardData = async () => {
  const churchData = await db.disciple.groupBy({
    by: ["church_status"],

    _count: true,
  })

  const cellData = await db.disciple.groupBy({
    by: ["cell_status"],
    _count: true,
    orderBy: {
      cell_status: "desc",
    },
  })

  const processData = await db.disciple.groupBy({
    by: ["process_level"],
    _count: true,
    orderBy: {
      process_level: "asc",
    },
  })

  const primaryData = await db.disciple.findMany({
    where: {
      isPrimary: true,
    },
    select: {
      name: true,
      _count: {
        select: {
          disciples: true,
        },
      },
    },
    orderBy: {
      disciples: {
        _count: "desc",
      },
    },
  })

  // this week reports
  const startDate = previousSunday(new Date())
  const endDate = nextSaturday(new Date())

  // past week reports
  const pastStartDate = previousSunday(startDate)
  const pastEndDate = nextSaturday(pastStartDate)

  const weeklyReports = await getWeeklyReports({ startDate, endDate })

  const pastWeeklyReports = await getWeeklyReports({
    startDate: pastStartDate,
    endDate: pastEndDate,
  })

  // tally data
  const disciplesTallyData = weeklyReports.leaders.map((d) => {
    const memberType = ["KIDS", "MEN", "WOMEN", "YOUTH", "YOUNGPRO"].reduce(
      (obj, curr) => ({
        [curr]: d.disciples.filter((i) => i.member_type === curr).length,
        ...obj,
      }),
      {}
    ) as Record<MemberType, number>

    const cellStatus = [
      "FIRST_TIMER",
      "SECOND_TIMER",
      "THIRD_TIMER",
      "REGULAR",
    ].reduce(
      (obj, curr) => ({
        [curr]: d.disciples.filter((i) => i.cell_status === curr).length,
        ...obj,
      }),
      {}
    ) as Record<CellStatus, number>

    const churchStatus = ["NACS", "ACS", "REGULAR"].reduce(
      (obj, curr) => ({
        [curr]: d.disciples.filter((i) => i.church_status === curr).length,
        ...obj,
      }),
      {}
    ) as Record<ChurchStatus, number>

    const processLevels = [
      "NONE",
      "PREENC",
      "ENCOUNTER",
      "LEADERSHIP_1",
      "LEADERSHIP_2",
      "LEADERSHIP_3",
    ].reduce(
      (obj, curr) => ({
        [curr]: d.disciples.filter((i) => i.process_level === curr).length,
        ...obj,
      }),
      {}
    ) as Record<ProcessLevel, number>

    return {
      memberType,
      cellStatus,
      churchStatus,
      processLevels,
      details: d,
    }
  })

  return {
    churchData,
    cellData,
    processData,
    weeklyReports,
    pastWeeklyReports,
    disciplesTallyData,
    primaryData: primaryData.map((d) => ({
      name: d.name,
      disciples: d._count.disciples,
    })),
  }
}
