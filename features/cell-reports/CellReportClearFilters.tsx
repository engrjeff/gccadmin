"use client"

import { XIcon } from "lucide-react"
import { parseAsArrayOf, parseAsString, useQueryStates } from "nuqs"

import { Button } from "@/components/ui/button"

export function CellReportClearFilters() {
  const [filters, setFilterQueries] = useQueryStates(
    {
      type: parseAsString,
      dateRange: parseAsString,
      leaderId: parseAsArrayOf(parseAsString),
    },
    { shallow: false }
  )

  if (Object.values(filters).every((f) => !f)) return null

  return (
    <Button
      size="sm"
      variant="outline"
      type="button"
      className="h-10 md:h-8"
      onClick={() => setFilterQueries(null)}
    >
      Clear Filters <XIcon size={16} />
    </Button>
  )
}
