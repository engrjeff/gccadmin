"use server"

import { isToday } from "date-fns"

import { prisma } from "@/lib/db"
import { authActionClient } from "@/lib/safe-action"
import { getNextCellStatus } from "@/lib/utils"

import { cellReportCreateSchema } from "./schema"

export const createCellReport = authActionClient
  .metadata({ actionName: "createCellReport" })
  .schema(cellReportCreateSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const { attendees, assistant_id, ...body } = parsedInput

    const cellReport = await prisma.cellReport.create({
      data: {
        ...body,
        leaderId: body.leaderId ? body.leaderId : user.discipleId!,
        date: new Date(parsedInput.date),
        has_custom_lesson: body.lesson_name ? true : false,
      },
      select: {
        id: true,
      },
    })

    // attendees
    const createdAttendees = await prisma.cellReportAttendees.createMany({
      data: attendees.map((attendee) => {
        return {
          assignedBy: user.discipleId!,
          disciple_id: attendee,
          cell_report_id: cellReport.id,
          cell_report_attendee_id: `${cellReport.id}-${attendee}`,
        }
      }),
    })

    // assistant
    if (assistant_id) {
      const assistant = await prisma.cellReportAssistant.create({
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
      const lessonsTaken = await prisma.lessonsTakenByDisciple.createMany({
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
    const attendedDisciples = await prisma.disciple.findMany({
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
        const updated = await prisma.disciple.update({
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

    // revalidatePath("/cell-reports")

    return {
      cellReport,
    }
  })
