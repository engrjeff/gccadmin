"use client"

import { Table } from "@tanstack/react-table"

import { useIsAdmin } from "@/hooks/use-isadmin"
import { usePrimaryLeaders } from "@/hooks/use-primary-leaders"
import { DataTableFacetedFilter } from "@/components/ui/data-table/faceted-filter"
import RenderIf from "@/components/render-if"

import { CellReportRecord } from "./columns"

interface CellReportFacetFiltersProps {
  table: Table<CellReportRecord>
}

function CellReportFacetFilters({ table }: CellReportFacetFiltersProps) {
  const primaryLeaders = usePrimaryLeaders()
  const { isAdmin, status } = useIsAdmin()

  if (status !== "authenticated") return null

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

      <RenderIf condition={isAdmin}>
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
      </RenderIf>
    </>
  )
}

export default CellReportFacetFilters
