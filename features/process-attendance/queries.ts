import { prisma } from "@/lib/db"

export async function getProcessAttendancePeriods() {
  try {
    const results = await prisma.processAttendancePeriod.findMany({
      include: { students: true },
    })

    return results
  } catch (error) {
    return []
  }
}

export interface GetProcessAttendanceDetailArgs {
  id: string
}

export async function getProcessAttendanceDetail(
  args: GetProcessAttendanceDetailArgs
) {
  try {
    const result = await prisma.processAttendancePeriod.findUnique({
      where: { id: args.id },
      include: {
        processLessonSeries: {
          select: {
            lessons: true,
          },
        },
        students: {
          include: {
            disciple: {
              include: {
                leader: { select: { name: true } },
                encounter_batch: { select: { batchName: true } },
              },
            },
          },
          orderBy: {
            disciple: {
              name: "asc",
            },
          },
        },
        attendanceRecords: {
          include: {
            teacher: { select: { name: true } },
            process_attendees: true,
          },
        },
      },
    })

    return result
  } catch (error) {
    return null
  }
}
