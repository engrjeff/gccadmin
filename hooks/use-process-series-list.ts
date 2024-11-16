"use client"

import { ProcessLessonSeries } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"

import { apiClient } from "@/lib/apiClient"

const getProcessSeriesList = async () => {
  const response = await apiClient.get<ProcessLessonSeries[]>(`/process-series`)

  if (response.status !== 200) return []

  return response.data
}

export function useProcessSeriesList() {
  return useQuery({
    queryKey: ["process-series-list"],
    queryFn: getProcessSeriesList,
  })
}
