"use client"

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

import {
  cellStatuses,
  churchStatuses,
  processLevels,
  processLevelStatuses,
} from "./constants"
import { DiscipleFiltersClearButton } from "./DiscipleFiltersClearButton"
import { LeadersFacetFilter } from "./LeadersFilter"

export function DiscipleFiltersMobile() {
  const { isAdmin } = useIsAdmin()

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

  const filterCount = Object.values(filters).flat().filter(Boolean)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          aria-label="open filters"
          className="h-10 shrink-0 lg:hidden"
        >
          <ListFilterIcon size={16} /> Filter
          {filterCount?.length ? (
            <Badge variant="FILTER">{filterCount.length}</Badge>
          ) : null}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="inset-x-3 bottom-3 flex flex-col rounded-lg border bg-background p-4"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader className="text-left">
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>
            Refine the display using the filters below.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-3">
          <TableFacetFilter
            filterKey="cell_status"
            title="Cell Status"
            options={cellStatuses}
          />
          <TableFacetFilter
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
          />
          {isAdmin ? <LeadersFacetFilter /> : null}
          <DiscipleFiltersClearButton />
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

export function DiscipleMoreFilters() {
  const { isAdmin } = useIsAdmin()

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

  const filterCount = Object.values(filters).flat().filter(Boolean)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          aria-label="open more filters"
          className="shrink-0"
        >
          <ListFilterIcon size={16} /> More
          {filterCount?.length ? (
            <Badge variant="FILTER">{filterCount.length}</Badge>
          ) : null}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="inset-y-2 right-2 flex h-auto flex-col rounded-lg border bg-background p-4"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader className="text-left">
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>
            Refine the display using the filters below.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-3">
          <TableFacetFilter
            filterKey="cell_status"
            title="Cell Status"
            options={cellStatuses}
          />
          <TableFacetFilter
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
          />
          {isAdmin ? <LeadersFacetFilter /> : null}
          <DiscipleFiltersClearButton />
        </div>

        <div>
          <SheetClose asChild>
            <Button size="sm" className="h-10 w-full md:h-8">
              View Results
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  )
}
