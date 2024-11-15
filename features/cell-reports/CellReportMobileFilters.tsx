"use client"

import { LeadersFacetFilter } from "@/features/disciples/LeadersFilter"
import { CellType } from "@prisma/client"
import { ListFilterIcon } from "lucide-react"
import { parseAsArrayOf, parseAsString, useQueryStates } from "nuqs"

import { useIsAdmin } from "@/hooks/use-isadmin"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TableFacetFilter } from "@/components/ui/data-table/table-facet-filter"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { CellReportClearFilters } from "./CellReportClearFilters"

export function CellReportMobileFilters() {
  const { isAdmin } = useIsAdmin()

  const [filters, setFilterQueries] = useQueryStates(
    {
      type: parseAsString,
      dateRange: parseAsString,
      leaderId: parseAsArrayOf(parseAsString),
    },
    { shallow: false }
  )

  const filterCount = Object.values(filters).flat().filter(Boolean)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          aria-label="open filters"
          className="h-8 shrink-0 lg:hidden"
        >
          <ListFilterIcon size={16} /> Filters
          {filterCount?.length ? (
            <Badge variant="FILTER">{filterCount.length}</Badge>
          ) : null}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="inset-x-3 bottom-3 flex flex-col rounded-lg border bg-background p-4"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader className="text-left">
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>
            Refine the display using the filters below.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-3">
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

        <div>
          <SheetClose asChild>
            <Button size="lg" className="w-full">
              View Results
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  )
}
