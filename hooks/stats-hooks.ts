import { useQuery } from "@tanstack/react-query"

import { statsApi } from "@/lib/apiClient"

export function useKPIData() {
  return useQuery({
    queryKey: ["kpi-data"],
    queryFn: async () => {
      const res = await statsApi.kpi.getData()
      return res.data
    },
  })
}

export function useChurchStatusData() {
  return useQuery({
    queryKey: ["church-status-data"],
    queryFn: async () => {
      const res = await statsApi.churchStatus.getData()
      return res.data
    },
  })
}
