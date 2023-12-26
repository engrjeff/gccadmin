import { Lesson, LessonSeries } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"

export type SeriesWithLessons = LessonSeries & { lessons: Lesson[] }

const getSelectedSeries = async (seriesId: string | null) => {
  if (!seriesId) return null

  const response = await fetch(`/api/lessons/${seriesId}`)
  if (!response.ok) return null
  const lessonSeriesData = await response.json()
  return lessonSeriesData
}

export function useSelectedSeries(seriesId: string | null) {
  return useQuery<SeriesWithLessons | null>({
    queryKey: ["lesson-series", seriesId],
    queryFn: () => getSelectedSeries(seriesId),
  })
}
