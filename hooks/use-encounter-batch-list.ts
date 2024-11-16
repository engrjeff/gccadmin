"use client"

import { EncounterBatchRecord } from "@/features/encounter/types"
import { useQuery } from "@tanstack/react-query"

const getEncounterBatchList = async () => {
  const response = await fetch(`/api/encounter`)
  if (!response.ok) return []
  const result = await response.json()
  return result as EncounterBatchRecord[]
}

export function useEncounterBatchList() {
  return useQuery({
    queryKey: ["encounter-batch-list"],
    queryFn: getEncounterBatchList,
  })
}
