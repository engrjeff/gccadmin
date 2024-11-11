"use client"

import {
  CellReport,
  CellReportAttendees,
  Disciple,
  Lesson,
} from "@prisma/client"
import { useQuery } from "@tanstack/react-query"

import { apiClient } from "@/lib/apiClient"

async function getAttendedCellGroups(discipleId: string) {
  const response = await apiClient.get<
    Array<
      CellReportAttendees & {
        cell_report: CellReport & {
          lesson: Lesson
          assistant: { disciple: Disciple }
        }
      }
    >
  >(`/disciples/${discipleId}/cell-groups-attended`)
  return response.data
}

export function useAttendedCellGroups(discipleId: string) {
  return useQuery({
    queryKey: ["attended-cellgroups", discipleId],
    queryFn: () => getAttendedCellGroups(discipleId),
  })
}
