"use client"

import { usePrimaryLeaders } from "@/hooks/use-primary-leaders"
import { TableFacetFilter } from "@/components/ui/data-table/table-facet-filter"

export function LeadersFacetFilter() {
  const leaders = usePrimaryLeaders()

  return (
    <TableFacetFilter
      filterKey="leaderId"
      title="Leader"
      options={leaders.data?.map((l) => ({ label: l.name, value: l.id })) ?? []}
      selectedLabelKey="label"
    />
  )
}
