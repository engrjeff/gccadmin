import { Disciple } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"

import { useIsAdmin } from "./use-isadmin"

const getPrimaryLeaders = async () => {
  const response = await fetch("/api/leaders")
  if (!response.ok) return []
  const primaryLeaders = await response.json()
  return primaryLeaders
}

export function usePrimaryLeaders(allowNonAdmin: boolean = false) {
  const { isAdmin } = useIsAdmin()
  return useQuery<Disciple[]>({
    queryKey: ["primary-leaders", allowNonAdmin],
    queryFn: getPrimaryLeaders,
    enabled: isAdmin || allowNonAdmin,
  })
}
