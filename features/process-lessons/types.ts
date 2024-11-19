import { ProcessLesson, ProcessLessonSeries } from "@prisma/client"

export interface ProcessSeriesWithLessons extends ProcessLessonSeries {
  lessons: ProcessLesson[]
}
