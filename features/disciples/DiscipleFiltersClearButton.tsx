"use client"

import { XIcon } from "lucide-react"
import { parseAsArrayOf, parseAsString, useQueryStates } from "nuqs"

import { Button } from "@/components/ui/button"

export function DiscipleFiltersClearButton() {
  const [filters, setFilterQueries] = useQueryStates(
    {
      cell_status: parseAsArrayOf(parseAsString),
      church_status: parseAsArrayOf(parseAsString),
      process_level: parseAsArrayOf(parseAsString),
      process_level_status: parseAsArrayOf(parseAsString),
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
