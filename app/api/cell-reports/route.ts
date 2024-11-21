import { NextRequest, NextResponse } from "next/server"
import { getCellReports } from "@/features/cell-reports/queries"
import { isToday } from "date-fns"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { prisma as db } from "@/lib/db"
import { getNextCellStatus } from "@/lib/utils"

import { cellReportCreateSchema } from "./schema"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    const json = await req.json()

    const { attendees, assistant_id, ...body } =
      cellReportCreateSchema.parse(json)

    const cellReport = await db.cellReport.create({
      data: {
        ...body,
        leaderId: body.leaderId ? body.leaderId : session.user.discipleId!,
        has_custom_lesson: body.lesson_name ? true : false,
      },
      select: {
        id: true,
      },
    })

    // attendees
    const createdAttendees = await db.cellReportAttendees.createMany({
      data: attendees.map((attendee) => {
        return {
          assignedBy: session.user.discipleId!,
          disciple_id: attendee,
          cell_report_id: cellReport.id,
          cell_report_attendee_id: `${cellReport.id}-${attendee}`,
        }
      }),
    })

    // assistant
    if (assistant_id) {
      const assistant = await db.cellReportAssistant.create({
        data: {
          disciple_report_id: `${cellReport.id}-${assistant_id}`, // report-assistant
          disciple_id: assistant_id,
          CellReport: {
            connect: {
              id: cellReport.id,
            },
          },
        },
        select: { disciple_id: true },
      })
    }

    //update lesson taken here
    if (body.lessonId) {
      const lessonsTaken = await db.lessonsTakenByDisciple.createMany({
        data: attendees.map((attendee) => {
          return {
            disciple_id: attendee,
            lesson_id: body.lessonId!,
            lesson_taken_disciple_id: `${cellReport.id}-${body.lessonId}-${attendee}`, // report-lesson-disciple
          }
        }),
      })
    }

    // update attendees' cell status
    // get first the attendees
    const attendedDisciples = await db.disciple.findMany({
      where: { id: { in: attendees } },
      select: {
        id: true,
        cell_status: true,
        church_status: true,
        createdAt: true,
      },
    })

    const updatedDisciples = await Promise.all(
      attendedDisciples.map(async (attendee) => {
        const updated = await db.disciple.update({
          where: { id: attendee.id },
          data: {
            cell_status: isToday(attendee.createdAt)
              ? attendee.cell_status
              : getNextCellStatus(attendee.cell_status),
          },
        })

        return updated
      })
    ).then((values) => values)

    return NextResponse.json(cellReport)
  } catch (error: any) {
    return new NextResponse(error.message || "Error", { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const params = Object.fromEntries(req.nextUrl.searchParams.entries())
    const reports = await getCellReports(params)

    return NextResponse.json(reports)
  } catch (error) {
    return NextResponse.json([])
  }
}
