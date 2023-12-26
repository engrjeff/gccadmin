import {
  CellReport,
  CellReportAssistant,
  CellReportAttendees,
  Disciple,
  Lesson,
} from "@prisma/client"

export interface CellAssistant extends CellReportAssistant {
  disciple: Disciple
}

export interface CellAttendee extends CellReportAttendees {
  disciple: Disciple
}

export type CellReportRecord = CellReport & {
  leader: Disciple
  lesson: Lesson | null
  attendees: CellAttendee[]
  assistant: CellAssistant | null
}
