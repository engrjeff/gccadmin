"use client"

import { Disciple } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"

import { apiClient } from "@/lib/apiClient"

async function getHandledDisciples(discipleId: string) {
  const response = await apiClient.get<
    Disciple & {
      handled_disciples: Array<{ id: string; name: string; isActive: boolean }>
    }
  >(`/disciples/${discipleId}/handled-disciples`)
  return response.data
}

export function useHandledDisciples(discipleId: string) {
  return useQuery({
    queryKey: ["handled-disciples", discipleId],
    queryFn: () => getHandledDisciples(discipleId),
  })
}
