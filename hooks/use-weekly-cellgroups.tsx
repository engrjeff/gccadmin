"use client"

import { usePathname } from "next/navigation"
import { DiscipleRecord } from "@/features/disciples/schema"
import { CellReport, Disciple } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"

import { apiClient } from "@/lib/apiClient"

export interface DiscipleWithCellReports extends Disciple {
  cell_reports: Array<
    CellReport & {
      _count: {
        attendees: number
      }
      assistant: {
        disciple: DiscipleRecord
      }
      attendees: Array<{
        disciple: Disciple
      }>
    }
  >
}

interface ReportResponse {
  cellReports: DiscipleWithCellReports[]
  trend: {
    value: number
    status: "increased" | "decreased"
  }
}

async function getWeeklyReports(
  view: "weekly" | "monthly" = "weekly"
): Promise<ReportResponse> {
  try {
    const response = await apiClient.get<ReportResponse>(
      "/reports/weekly-cellgroups",
      { params: { view } }
    )
    return response.data
  } catch (error) {
    return {
      cellReports: [],
      trend: {
        value: 0,
        status: "increased",
      },
    }
  }
}

export function useWeeklyCellGroups() {
  const pathname = usePathname()

  const view = pathname === "/dashboard/monthly" ? "monthly" : "weekly"

  return useQuery({
    queryKey: ["weekly-cellgroups"],
    queryFn: () => getWeeklyReports(view),
  })
}
