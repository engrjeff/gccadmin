"use client"

import { Disciple } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"

const getDisciples = async () => {
  const response = await fetch(`/api/disciples/all`)
  if (!response.ok) return []
  const disciples = await response.json()
  return disciples as Disciple[]
}

export function useDisciples() {
  return useQuery({
    queryKey: ["active-disciples"],
    queryFn: getDisciples,
  })
}
