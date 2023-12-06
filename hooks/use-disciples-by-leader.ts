import { Disciple } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"

const getDisciplesOfLeader = async (leaderId: string) => {
  const response = await fetch(`/api/leaders/${leaderId}/disciples`)
  if (!response.ok) return []
  const disciplesOfLeader = await response.json()
  return disciplesOfLeader
}

export function useDisciplesOfLeader(leaderId?: string) {
  return useQuery<Disciple[]>({
    queryKey: [`leader-disciples`, leaderId],
    queryFn: () => (!leaderId ? [] : getDisciplesOfLeader(leaderId)),
  })
}
