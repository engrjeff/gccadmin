"use client"

import { Lesson, LessonsTakenByDisciple } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"

import { apiClient } from "@/lib/apiClient"

async function getLessonsTakenByDisciple(discipleId: string) {
  const response = await apiClient.get<
    Array<LessonsTakenByDisciple & { lesson: Lesson }>
  >(`/disciples/${discipleId}/lessons-taken`)
  return response.data
}

export function useLessonsTakenByDisciple(discipleId: string) {
  return useQuery({
    queryKey: ["lessons-taken", discipleId],
    queryFn: () => getLessonsTakenByDisciple(discipleId),
  })
}
