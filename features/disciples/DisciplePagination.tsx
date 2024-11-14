"use client"

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

import { usePageState } from "@/hooks/use-page-state"
import { Button } from "@/components/ui/button"

import { PageInfo } from "./schema"

export function DisciplePagination({ pageInfo }: { pageInfo: PageInfo }) {
  const [page, setPage] = usePageState(pageInfo.page)

  if (pageInfo.total === 0) return null

  const start = (pageInfo.page - 1) * pageInfo.pageSize + 1
  const end = start + pageInfo.itemCount - 1

  return (
    <div className="flex items-center justify-between">
      <div className="flex-1 text-sm text-muted-foreground">
        Showing{" "}
        <span className="text-foreground">
          {start}-{end}
        </span>{" "}
        of <span className="text-foreground">{pageInfo.total}</span>{" "}
        {pageInfo.total > 1 ? "disciples" : "disciple"}.
      </div>

      {pageInfo.totalPages > 1 ? (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            disabled={!pageInfo.page || pageInfo.page === 1}
            onClick={() => setPage(1)}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            disabled={!pageInfo.page || pageInfo.page === 1}
            onClick={() => setPage(page - 1)}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            disabled={pageInfo.page === pageInfo.totalPages}
            onClick={() => setPage(page + 1)}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            disabled={pageInfo.page === pageInfo.totalPages}
            onClick={() => setPage(pageInfo.totalPages)}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      ) : null}
    </div>
  )
}
