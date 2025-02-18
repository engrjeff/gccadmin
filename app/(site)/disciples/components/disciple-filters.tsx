import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"

import { Option } from "@/types/common"
import { cellStatuses, churchStatuses } from "@/lib/constants"
import { useIsAdmin } from "@/hooks/use-isadmin"
import { Button } from "@/components/ui/button"
import { DataTableFacetedFilter } from "@/components/ui/data-table/faceted-filter"
import { Separator } from "@/components/ui/separator"

import { processLevels, processLevelStatuses } from "../constants"
import { DiscipleWithLeader } from "./columns"

interface DiscipleFiltersProps {
  table: Table<DiscipleWithLeader>
  leadersOptions: Option[]
}

function DiscipleFilters({ table, leadersOptions }: DiscipleFiltersProps) {
  const isFiltered =
    table.getPreFilteredRowModel().rows.length >
    table.getFilteredRowModel().rows.length

  const { isAdmin, status } = useIsAdmin()

  if (status !== "authenticated") return null

  return (
    <>
      {isAdmin ? (
        <DataTableFacetedFilter
          column={table.getColumn("leaderName")}
          title="Leader"
          options={leadersOptions}
        />
      ) : null}
      <DataTableFacetedFilter
        column={table.getColumn("cell_status")}
        title="Cell Status"
        options={cellStatuses}
      />
      <DataTableFacetedFilter
        column={table.getColumn("church_status")}
        title="Church Status"
        options={churchStatuses}
      />
      <DataTableFacetedFilter
        column={table.getColumn("process_level")}
        title="Process"
        options={processLevels}
      />
      <DataTableFacetedFilter
        column={table.getColumn("process_level_status")}
        title="Process Status"
        options={processLevelStatuses}
      />
      {isFiltered && (
        <>
          <Separator orientation="vertical" className="mx-2 h-4" />
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        </>
      )}
    </>
  )
}

export default DiscipleFilters
