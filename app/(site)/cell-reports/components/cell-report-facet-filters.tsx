"use client"

import { Table } from "@tanstack/react-table"

import { usePrimaryLeaders } from "@/hooks/use-primary-leaders"
import { DataTableFacetedFilter } from "@/components/ui/data-table/faceted-filter"

import { CellReportRecord } from "./columns"

interface CellReportFacetFiltersProps {
  table: Table<CellReportRecord>
}

function CellReportFacetFilters({ table }: CellReportFacetFiltersProps) {
  const primaryLeaders = usePrimaryLeaders()

  return (
    <>
      {table.getColumn("type") && (
        <DataTableFacetedFilter
          column={table.getColumn("type")}
          title="Cell Type"
          options={["SOULWINNING", "OPEN", "DISCIPLESHIP"].map((i) => ({
            label: i,
            value: i,
          }))}
        />
      )}
      {table.getColumn("leaderName") && (
        <DataTableFacetedFilter
          column={table.getColumn("leaderName")}
          title="Leader"
          options={
            primaryLeaders.data?.map((d) => ({
              label: d.name,
              value: d.name,
            })) ?? []
          }
        />
      )}
    </>
  )
}

export default CellReportFacetFilters
