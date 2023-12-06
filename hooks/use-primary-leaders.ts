import { Disciple } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"

const getPrimaryLeaders = async () => {
  const response = await fetch("/api/leaders")
  if (!response.ok) return []
  const primaryLeaders = await response.json()
  return primaryLeaders
}

export function usePrimaryLeaders() {
  return useQuery<Disciple[]>({
    queryKey: ["primary-leaders"],
    queryFn: getPrimaryLeaders,
  })
}
