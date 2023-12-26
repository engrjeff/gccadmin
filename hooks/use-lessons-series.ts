import { Lesson, LessonSeries } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"

export type SeriesWithLessons = LessonSeries & { lessons: Lesson[] }

const getLessonsSeries = async () => {
  const response = await fetch("/api/lessons")
  if (!response.ok) return []
  const lessonSeriesData = await response.json()
  return lessonSeriesData
}

export function useLessonsSeries() {
  return useQuery<SeriesWithLessons[]>({
    queryKey: ["lessons-series"],
    queryFn: getLessonsSeries,
  })
}
