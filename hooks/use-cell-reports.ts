"use client"

import { useSearchParams } from "next/navigation"
import { PageInfo } from "@/features/cell-reports/schema"
import { CellReportRecord } from "@/features/cell-reports/types"
import { useQuery } from "@tanstack/react-query"

import { apiClient } from "@/lib/apiClient"

export function useCellReports() {
  const searchParams = useSearchParams()

  const params = Object.fromEntries(searchParams.entries())

  const reports = useQuery({
    queryKey: ["cell-reports", params],
    queryFn: async () => {
      const response = await apiClient.get<{
        cellReports: CellReportRecord[]
        pageInfo: PageInfo
      }>("/cell-reports", {
        params,
      })
      return response.data
    },
  })

  return reports
}
