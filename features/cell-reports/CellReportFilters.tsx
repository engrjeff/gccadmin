"use client"

import { LeadersFacetFilter } from "@/features/disciples/LeadersFilter"
import { CellType } from "@prisma/client"

import { useIsAdmin } from "@/hooks/use-isadmin"
import { TableFacetFilter } from "@/components/ui/data-table/table-facet-filter"

import { CellReportClearFilters } from "./CellReportClearFilters"
import { CellReportMobileFilters } from "./CellReportMobileFilters"

export function CellReportFilters() {
  const { isAdmin } = useIsAdmin()

  return (
    <div className="flex flex-nowrap items-center justify-end gap-3 overflow-auto px-1 lg:justify-start lg:py-2">
      <CellReportMobileFilters />
      <div className="hidden flex-col flex-nowrap gap-3 lg:flex lg:flex-row lg:items-center">
        <p className="text-sm font-medium">Filters </p>
        {isAdmin ? <LeadersFacetFilter /> : null}
        <TableFacetFilter
          filterKey="type"
          title="Cell Type"
          singleSelection
          options={[
            { label: "Soul Winning", value: CellType.SOULWINNING },
            { label: "Open Cell", value: CellType.OPEN },
            { label: "Discipleship", value: CellType.DISCIPLESHIP },
          ]}
        />
        <TableFacetFilter
          filterKey="dateRange"
          title="Date Range"
          singleSelection
          options={[
            { label: "This Week", value: "this_week" },
            { label: "Last Week", value: "last_week" },
            { label: "This Month", value: "this_month" },
            { label: "Last Month", value: "last_month" },
          ]}
        />
        <CellReportClearFilters />
      </div>
    </div>
  )
}
