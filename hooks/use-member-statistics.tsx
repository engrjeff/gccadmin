"use client"

import { useQuery } from "@tanstack/react-query"

import { apiClient } from "@/lib/apiClient"

type RequestType = "memberType" | "cellStatus" | "churchStatus"

type Key = "member_type" | "cell_status" | "church_status"

type Result<K extends Key, T> = {
  _count: {
    [key in K]: number
  }
} & {
  [key in K]: T
}

async function getMemberStatistics<K extends Key, T>(type: RequestType) {
  const result = await apiClient.get<Result<K, T>[] | null>(
    "/reports/member-statistics",
    {
      params: { type },
    }
  )

  return result.data
}

export function useMemberStatistics<K extends Key, T>(type: RequestType) {
  return useQuery({
    queryKey: ["member-statistics", type],
    queryFn: () => getMemberStatistics<K, T>(type),
  })
}
