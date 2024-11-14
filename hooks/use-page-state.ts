"use client"

import { useSearchParams } from "next/navigation"
import { parseAsInteger, useQueryState } from "nuqs"

export function usePageState(initialPage?: number) {
  const searchParams = useSearchParams()

  const pageQuery = searchParams.get("page")

  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger
      .withDefault(
        initialPage ? initialPage : pageQuery ? Number(pageQuery) : 1
      )
      .withOptions({ shallow: false })
  )

  return [page, setPage] as const
}
