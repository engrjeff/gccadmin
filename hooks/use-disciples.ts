"use client"

import { Disciple, ProcessLevel } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"

import { apiClient } from "@/lib/apiClient"

interface GetDisciplesArgs {
  processLevel?: ProcessLevel
  withBatch?: boolean
}

const getDisciples = async (args: GetDisciplesArgs) => {
  const response = await apiClient.get<Disciple[]>(`/disciples/all`, {
    params: args,
  })

  if (response.status !== 200) return []

  return response.data
}

export function useDisciples(args: GetDisciplesArgs) {
  return useQuery({
    queryKey: ["active-disciples", args],
    queryFn: () => getDisciples(args),
  })
}
