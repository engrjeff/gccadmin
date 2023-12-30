import {
  CellStatus,
  ChurchStatus,
  MemberType,
  ProcessLevel,
} from "@prisma/client"
import { endOfWeek, format, parseISO, startOfWeek } from "date-fns"
import addDays from "date-fns/addDays"
import isWithinInterval from "date-fns/isWithinInterval"
import previousSunday from "date-fns/previousSunday"

import { prisma as db } from "@/lib/db"

const getWeeklyReports = async (params: { startDate: Date; endDate: Date }) => {
  const reports = await db.disciple.findMany({
    where: {
      isPrimary: true,
      name: {
        not: "GCC Admin",
      },
    },
    include: {
      disciples: {
        where: {
          isActive: true,
          isDeleted: false,
        },
      },
      cell_reports: {
        where: {
          date: {
            gte: params.startDate,
            lte: params.endDate,
          },
        },
        include: {
          leader: true,
          assistant: {
            select: {
              disciple: true,
            },
          },
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
        r.cell_reports.map((c) => c.attendees.map((a) => a.disciple.id)).flat()
      ).size,
      cgByAssistant: r.cell_reports
        .filter((cg) => Boolean(cg.assistant_id))
        .reduce<
          {
            id: string
            name: string
            assistedCG: number
          }[]
        >((grouped, cg) => {
          const found = grouped.find((a) => a.id === cg.assistant?.disciple.id)

          if (found) {
            grouped = grouped.map((a) =>
              a.id === found.id ? { ...a, assistedCG: a.assistedCG + 1 } : a
            )
          }

          if (!found) {
            grouped = [
              ...grouped,
              {
                id: cg.assistant?.disciple.id!,
                name: cg.assistant?.disciple.name!,
                assistedCG: 1,
              },
            ]
          }

          return grouped
        }, []),
    })),
  ].sort((a, b) => {
    if (a.cgCount > b.cgCount) return -1
    if (a.cgCount < b.cgCount) return 1
    return 0
  })

  const assistantWithMostCG = cgCountByLeaderData
    .filter((i) => i.cgByAssistant.length > 0)
    .map((a) => {
      const withMostAssisted = a.cgByAssistant.reduce<
        { id: string; name: string; assistedCG: number } | undefined
      >((withMax, curr) => {
        if (withMax) {
          if (curr.assistedCG > withMax!.assistedCG) {
            return curr
          }
        } else {
          return curr
        }

        return withMax
      }, undefined)

      return withMostAssisted
    })
    .sort((a, b) => {
      if (a!.assistedCG > b!.assistedCG) return -1
      if (a!.assistedCG < b!.assistedCG) return 1
      return 0
    })

  return {
    totalCGsDone,
    cgCountByLeaderData,
    leaders: reports,
    assistantWithMostCG,
  }
}

interface Options {
  from?: string
  to?: string
  isAll?: boolean
}

export const getDashboardData = async ({ from, to, isAll }: Options) => {
  const primaryData = await db.disciple.findMany({
    where: {
      isPrimary: true,
    },
    select: {
      id: true,
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

  const now = new Date(new Date().toDateString()).toISOString()

  const start = previousSunday(parseISO(now))

  const startDate = parseISO(
    from ? new Date(from).toISOString() : format(start, "yyyy-MM-dd")
  )
  const endDate = parseISO(
    to ? new Date(to).toISOString() : format(addDays(start, 6), "yyyy-MM-dd")
  )

  // console.log(startDate, endDate)

  // past week reports
  const pastStartDate = previousSunday(startDate)
  const pastEndDate = addDays(pastStartDate, 6)

  console.log(pastStartDate, pastEndDate)

  const weeklyReports = await getWeeklyReports({ startDate, endDate })

  const pastWeeklyReports = await getWeeklyReports({
    startDate: pastStartDate,
    endDate: pastEndDate,
  })

  const KPIDataPerLeader = weeklyReports.leaders.map((leader) => {
    const activeInChurch = leader.disciples.filter(
      (d) => d.church_status === "REGULAR"
    ).length
    const activeInCell = leader.disciples.filter(
      (d) => d.cell_status === "REGULAR"
    ).length
    const activeInProcess = leader.disciples.filter(
      (d) => d.process_level !== "NONE"
    ).length

    const newlyWonSouls = leader.cell_reports
      .map((r) => r.attendees)
      .flat()
      .filter(
        (r) =>
          r.disciple.cell_status === "FIRST_TIMER" &&
          r.disciple.church_status === "NACS" &&
          isWithinInterval(r.disciple.createdAt, {
            start: startDate,
            end: endDate,
          })
      ).length

    return {
      activeInChurch,
      activeInCell,
      activeInProcess,
      newlyWonSouls,
      totalDisciples: leader.disciples.length,
    }
  })

  const totalKPIData = KPIDataPerLeader.reduce<
    Record<keyof (typeof KPIDataPerLeader)[number], number>
  >(
    (countObj, data) => {
      return {
        activeInChurch: countObj.activeInChurch + data.activeInChurch,
        activeInCell: countObj.activeInCell + data.activeInCell,
        activeInProcess: countObj.activeInProcess + data.activeInProcess,
        totalDisciples: countObj.totalDisciples + data.totalDisciples,
        newlyWonSouls: countObj.newlyWonSouls + data.newlyWonSouls,
      }
    },
    {
      activeInCell: 0,
      activeInChurch: 0,
      activeInProcess: 0,
      totalDisciples: 0,
      newlyWonSouls: 0,
    }
  )

  const rawMemberTypeData = await db.disciple.groupBy({
    by: ["member_type"],
    where: {
      isActive: true,
      name: {
        not: "GCC Admin",
      },
    },
    _count: {
      member_type: true,
    },
  })

  const rawChurchData = await db.disciple.groupBy({
    by: ["church_status"],
    where: {
      isActive: true,
      name: {
        not: "GCC Admin",
      },
    },
    _count: {
      church_status: true,
    },
  })

  const rawCellData = await db.disciple.groupBy({
    by: ["cell_status"],
    where: {
      isActive: true,
      name: {
        not: "GCC Admin",
      },
    },
    _count: {
      cell_status: true,
    },
  })

  const rawProcessData = await db.disciple.groupBy({
    by: ["process_level"],
    where: {
      isActive: true,
      name: {
        not: "GCC Admin",
      },
    },
    _count: {
      process_level: true,
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

  return {
    churchData,
    cellData,
    processData,
    weeklyReports,
    pastWeeklyReports,
    KPIDataPerLeader,
    totalKPIData,
    memberTypeData,
    primaryData: primaryData.map((d) => ({
      ...d,
      disciples: d._count.disciples,
    })),
  }
}

export const getKPIData = async () => {
  const now = new Date()

  now.setHours(0, 0, 0, 0)
  const startDate = previousSunday(now)
  const endDate = addDays(startDate, 6)

  const disciples = await db.disciple.findMany({
    where: {
      isActive: true,
      isDeleted: false,
      name: {
        not: "GCC Admin",
      },
    },
  })

  const totalDisciples = disciples.length

  const activeInChurch = disciples.filter(
    (d) => d.church_status === "REGULAR"
  ).length

  const activeInCell = disciples.filter(
    (d) => d.cell_status === "REGULAR"
  ).length

  const disciplesInProcess = disciples.filter(
    (d) => d.process_level !== "NONE"
  ).length

  const cgThisWeek = await db.cellReport.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      attendees: {
        include: {
          disciple: true,
        },
      },
    },
  })

  const newSouls = cgThisWeek.reduce((total, cg) => {
    const attendess = cg.attendees.filter(
      (a) =>
        isWithinInterval(a.disciple.createdAt, {
          start: startDate,
          end: endDate,
        }) && a.disciple.cell_status === "FIRST_TIMER"
    )

    return total + attendess.length
  }, 0)

  return {
    totalDisciples,
    activeInChurch,
    activeInCell,
    disciplesInProcess,
    newlyWonSouls: newSouls,
  }
}

export const getLeadersData = async () => {
  const leadersData = await db.disciple.findMany({
    where: {
      isPrimary: true,
    },
    select: {
      id: true,
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

  const totalDisciples = await db.disciple.count({
    where: {
      isActive: true,
      isDeleted: false,
      name: {
        not: "GCC Admin",
      },
    },
  })

  return { leadersData, totalDisciples }
}

export const getCellReportData = async (options: Options = {}) => {
  const now = new Date()

  const start = previousSunday(now)

  const startDate = options.from ? options.from : format(start, "yyyy-MM-dd")

  const endDate = options.to
    ? options.to
    : format(addDays(start, 6), "yyyy-MM-dd")

  console.log("CELL REPORT THIS DATE RANGE: ", startDate, endDate)

  const weeklyReports = await getWeeklyReports({
    startDate: new Date(startDate),
    endDate: new Date(endDate),
  })

  // past week reports
  const sundayOfPastWeek = previousSunday(startOfWeek(new Date(startDate)))
  const saturdayOfPastWeek = endOfWeek(sundayOfPastWeek)

  const pastStartDate = format(sundayOfPastWeek, "yyyy-MM-dd")
  const pastEndDate = format(saturdayOfPastWeek, "yyyy-MM-dd")

  console.log("PAST WEEK: ", pastStartDate, pastEndDate)

  const pastWeeklyReports = await getWeeklyReports({
    startDate: new Date(pastStartDate),
    endDate: new Date(pastEndDate),
  })

  return { weeklyReports, pastWeeklyReports }
}

export const getStatusData = async () => {
  console.time("status data")

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

  console.timeEnd("status data")

  return {
    churchData,
    cellData,
    processData,
    memberTypeData,
  }
}

const getChurchStatusText = (churchStatus: ChurchStatus) => {
  switch (churchStatus) {
    case "ACS":
      return "Attended Church"
    case "NACS":
      return "Not Yet Attended Church"
    case "REGULAR":
      return "Regular Attendees"
  }
}

const getCellStatusText = (cellStatus: CellStatus) => {
  switch (cellStatus) {
    case "FIRST_TIMER":
      return "Newly won soul"
    case "SECOND_TIMER":
      return "2nd-time attendee"
    case "THIRD_TIMER":
      return "3rd-time attendee"
    case "REGULAR":
      return "Regular attendee"
  }
}

const getProcessLevelText = (processLevel: ProcessLevel) => {
  switch (processLevel) {
    case "NONE":
      return "Not in the process yet"
    case "PREENC":
      return "Pre-Encounter delegates"
    case "ENCOUNTER":
      return "Attended Ecnounter"
    case "LEADERSHIP_1":
      return "In Leadership Level 1"
    case "LEADERSHIP_2":
      return "In Leadership Level 2"
    case "LEADERSHIP_3":
      return "In Leadership Level 3"
  }
}

const getMemberTypeText = (value: MemberType) => {
  switch (value) {
    case "KIDS":
      return {
        name: "Kids",
        desc: "Kids, elementary",
      }
    case "MEN":
      return {
        name: "Men",
        desc: "Married men, fathers",
      }
    case "WOMEN":
      return {
        name: "Women",
        desc: "Married women, mothers",
      }
    case "YOUTH":
      return {
        name: "Youth",
        desc: "Late teens, students",
      }
    case "YOUNGPRO":
      return {
        name: "Young Pro",
        desc: "Young, unmarried professionals",
      }
  }
}
