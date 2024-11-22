"use server"

import { isToday } from "date-fns"
import * as z from "zod"

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

    return {
      cellReport,
    }
  })

export const updateCellReport = authActionClient
  .metadata({ actionName: "updateCellReport" })
  .schema(
    cellReportCreateSchema.extend({
      id: z.string({ required_error: "Cell Report ID is required." }),
    })
  )
  .action(async ({ parsedInput: { id, ...data }, ctx: { user } }) => {
    const foundReport = await prisma.cellReport.findUnique({
      where: { id },
      include: { attendees: true },
    })

    if (!foundReport) throw new Error("Cannot find Cell Report.")

    const { assistant_id, leaderId, lessonId, attendees, ...body } = data

    const cellReport = await prisma.cellReport.update({
      where: { id },
      data: {
        type: body.type,
        venue: body.venue,
        time: body.time,
        date: body.date ? new Date(body.date) : foundReport.date,
        scripture_references: body.scripture_references,
        lesson_name: body.lesson_name,
        leaderId,
        has_custom_lesson: body.lesson_name ? true : false,
        lessonId: body.lesson_name ? null : undefined,
        assistant_id: !assistant_id ? null : undefined,
      },
    })

    const reportAssistantId = `${foundReport.id}-${assistant_id}` // report-assistant

    // update assistant
    if (assistant_id && foundReport.assistant_id !== reportAssistantId) {
      if (foundReport.assistant_id) {
        await prisma.cellReportAssistant.delete({
          where: {
            disciple_report_id: foundReport.assistant_id,
          },
        })
      }

      await prisma.cellReportAssistant.create({
        data: {
          disciple_report_id: reportAssistantId,
          disciple_id: assistant_id,
          CellReport: {
            connect: {
              id: foundReport.id,
            },
          },
        },
      })
    }

    if (!assistant_id && foundReport.assistant_id) {
      if (foundReport.assistant_id) {
        await prisma.cellReportAssistant.delete({
          where: {
            disciple_report_id: foundReport.assistant_id,
          },
        })
      }
    }

    await prisma.lessonsTakenByDisciple.deleteMany({
      where: {
        lesson_taken_disciple_id: {
          in: foundReport.attendees.map(
            (a) => `${foundReport.id}-${lessonId}-${a.disciple_id}`
          ),
        }, // report-lesson-disciple
      },
    })

    // update lesson
    if (lessonId && !body.lesson_name) {
      await prisma.cellReport.update({
        where: { id },
        data: {
          lessonId,
          has_custom_lesson: false,
          lesson_name: "",
        },
      })

      await prisma.lessonsTakenByDisciple.createMany({
        data: attendees.map((attendee) => {
          return {
            disciple_id: attendee,
            lesson_id: lessonId,
            lesson_taken_disciple_id: `${foundReport.id}-${lessonId}-${attendee}`, // report-lesson-disciple
          }
        }),
      })
    }

    // update attendees
    const currentAttendees = foundReport.attendees.map((a) => a.disciple_id)

    const attendeesToAdd =
      data.attendees?.filter((c) => !currentAttendees?.includes(c)) ?? []

    const attendeesToRemove =
      currentAttendees?.filter((c) => !data.attendees?.includes(c)) ?? []

    if (attendeesToAdd.length) {
      await prisma.cellReportAttendees.createMany({
        data: attendeesToAdd.map((attendee) => {
          return {
            assignedBy: user.discipleId!,
            disciple_id: attendee,
            cell_report_id: foundReport.id,
            cell_report_attendee_id: `${foundReport.id}-${attendee}`,
          }
        }),
      })
    }

    if (attendeesToRemove.length) {
      await prisma.cellReportAttendees.deleteMany({
        where: {
          cell_report_attendee_id: {
            in: attendeesToRemove.map((a) => `${foundReport.id}-${a}`),
          },
        },
      })
    }

    // update attendees' cell status
    // get first the attendees
    const addedDisciples = await prisma.disciple.findMany({
      where: { id: { in: attendeesToAdd } },
      select: {
        id: true,
        cell_status: true,
        church_status: true,
        createdAt: true,
      },
    })

    const updatedDisciples = await Promise.all(
      addedDisciples.map(async (attendee) => {
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

    return {
      cellReport,
    }
  })
