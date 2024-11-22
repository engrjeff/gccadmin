"use client"

import { DiscipleRecord } from "@/features/disciples/schema"
import { CellReport, Disciple } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"

import { apiClient } from "@/lib/apiClient"

interface DiscipleWithCellReports extends Disciple {
  cell_reports: Array<
    CellReport & {
      _count: {
        attendees: number
      }
      assistant: {
        disciple: DiscipleRecord
      }
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

async function getWeeklyReports(): Promise<ReportResponse> {
  try {
    const response = await apiClient.get<ReportResponse>(
      "/reports/weekly-cellgroups"
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
  return useQuery({
    queryKey: ["weekly-cellgroups"],
    queryFn: getWeeklyReports,
  })
}
