import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"

import { Option } from "@/types/common"
import { cellStatuses, churchStatuses } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { DataTableFacetedFilter } from "@/components/ui/data-table/faceted-filter"
import { Separator } from "@/components/ui/separator"
import RenderIf from "@/components/render-if"

import { DiscipleWithLeader } from "./columns"

interface DiscipleFiltersProps {
  table: Table<DiscipleWithLeader>
  leadersOptions: Option[]
}

function DiscipleFilters({ table, leadersOptions }: DiscipleFiltersProps) {
  const isFiltered =
    table.getPreFilteredRowModel().rows.length >
    table.getFilteredRowModel().rows.length

  return (
    <>
      <RenderIf condition={leadersOptions.length > 0}>
        <DataTableFacetedFilter
          column={table.getColumn("leaderName")}
          title="Leader"
          options={leadersOptions}
        />
      </RenderIf>
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
