"use client"

import { useIsAdmin } from "@/hooks/use-isadmin"
import { TableFacetFilter } from "@/components/ui/data-table/table-facet-filter"
import { SearchField } from "@/components/ui/search-field"

import { cellStatuses, churchStatuses } from "./constants"
import { DiscipleFiltersClearButton } from "./DiscipleFiltersClearButton"
import {
  DiscipleFiltersMobile,
  DiscipleMoreFilters,
} from "./DiscipleFiltersMobile"
import { LeadersFacetFilter } from "./LeadersFilter"

export function DiscipleFilters() {
  const { isAdmin } = useIsAdmin()

  return (
    <div className="flex flex-nowrap items-center gap-3 overflow-auto px-1 py-2">
      <div className="flex-1 shrink-0 lg:flex-none">
        <SearchField />
      </div>

      <DiscipleFiltersMobile />

      <div className="hidden flex-col flex-nowrap gap-3 lg:flex lg:flex-row lg:items-center">
        {isAdmin ? <LeadersFacetFilter /> : null}
        <TableFacetFilter
          filterKey="cell_status"
          title="Cell Status"
          options={cellStatuses}
        />
        {!isAdmin ? (
          <TableFacetFilter
            filterKey="church_status"
            title="Church Status"
            options={churchStatuses}
          />
        ) : null}
        {/*<TableFacetFilter
          filterKey="church_status"
          title="Church Status"
          options={churchStatuses}
        />
         <TableFacetFilter
          filterKey="process_level"
          title="Process"
          options={processLevels}
        />
        <TableFacetFilter
          filterKey="process_level_status"
          title="Process Status"
          options={processLevelStatuses}
        /> */}
        <DiscipleMoreFilters />
        <DiscipleFiltersClearButton />
      </div>
    </div>
  )
}
