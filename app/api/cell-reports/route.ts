import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { prisma as db } from "@/lib/db"

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

      console.log(assistant.disciple_id)
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

      console.log(lessonsTaken.count)
    }

    return NextResponse.json(cellReport)
  } catch (error: any) {
    return new NextResponse(error.message || "Error", { status: 500 })
  }
}
