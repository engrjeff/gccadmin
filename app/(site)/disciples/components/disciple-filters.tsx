import { Column, Table } from "@tanstack/react-table"
import { Check, Filter, X } from "lucide-react"

import { type Option } from "@/types/common"
import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { DataTableFacetedFilter } from "@/components/ui/data-table/faceted-filter"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

import { cellStatuses, churchStatuses, memberTypes } from "../constants"
import { DiscipleWithLeader } from "./columns"

interface DiscipleFiltersProps {
  table: Table<DiscipleWithLeader>
  leadersOptions: Option[]
}

function DiscipleFilters({ table, leadersOptions }: DiscipleFiltersProps) {
  const filterValues = table
    .getAllColumns()
    .map((col) => col.getFilterValue())
    .filter(Boolean)
    .flat() as string[]

  const isFiltered =
    table.getPreFilteredRowModel().rows.length >
    table.getFilteredRowModel().rows.length

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="h-8 border-dashed">
            <Filter className="mr-2 h-4 w-4" /> Filters
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[230px] px-0" align="end">
          <span className="px-4 font-semibold">Filters</span>
          <Separator className="mt-4" />
          <Accordion type="single" collapsible>
            {leadersOptions.length > 0 && (
              <AccordionItem value="leaderName">
                <AccordionTrigger className="px-4 py-2 text-sm hover:bg-accent hover:no-underline">
                  Leaders
                </AccordionTrigger>
                <AccordionContent>
                  <FilterItem
                    column={table.getColumn("leaderName")}
                    title="Leaders"
                    options={leadersOptions}
                    hasSearch
                  />
                </AccordionContent>
              </AccordionItem>
            )}
            <AccordionItem value="cell_status">
              <AccordionTrigger className="px-4 py-2 text-sm hover:bg-accent hover:no-underline">
                Cell Status
              </AccordionTrigger>
              <AccordionContent>
                <FilterItem
                  column={table.getColumn("cell_status")}
                  title="Cell Status"
                  options={cellStatuses}
                />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="church_status">
              <AccordionTrigger className="px-4 py-2 text-sm hover:bg-accent hover:no-underline">
                Church Status
              </AccordionTrigger>
              <AccordionContent>
                <FilterItem
                  column={table.getColumn("church_status")}
                  title="Church Status"
                  options={churchStatuses}
                />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="member_type">
              <AccordionTrigger className="px-4 py-2 text-sm hover:bg-accent hover:no-underline">
                Member Type
              </AccordionTrigger>
              <AccordionContent>
                <FilterItem
                  column={table.getColumn("member_type")}
                  title="Member Type"
                  options={memberTypes}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </PopoverContent>
      </Popover>

      {isFiltered && (
        <>
          <Separator orientation="vertical" className="mx-2 h-4" />
          {filterValues.map((value) => (
            <Badge
              key={value}
              className="rounded-sm bg-sky-500 px-1 font-normal capitalize dark:bg-sky-700"
            >
              {value.split("_").join(" ")}
            </Badge>
          ))}
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
    </div>
  )
}

interface DataTableFacetedFilter<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
  hasSearch?: boolean
  options: Option[]
}

function FilterItem<TData, TValue>({
  column,
  title,
  hasSearch = false,
  options,
}: DataTableFacetedFilter<TData, TValue>) {
  if (options.length === 0) return null

  const facets = column?.getFacetedUniqueValues()
  const selectedValues = new Set(column?.getFilterValue() as string[])

  return (
    <Command>
      {hasSearch && <CommandInput placeholder={title} />}
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {options.map((option) => {
            const isSelected = selectedValues.has(option.value)
            return (
              <CommandItem
                key={option.value}
                onSelect={() => {
                  if (isSelected) {
                    selectedValues.delete(option.value)
                  } else {
                    selectedValues.add(option.value)
                  }
                  const filterValues = Array.from(selectedValues)
                  column?.setFilterValue(
                    filterValues.length ? filterValues : undefined
                  )
                }}
              >
                <div
                  className={cn(
                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-foreground",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "opacity-50 [&_svg]:invisible"
                  )}
                >
                  <Check className={cn("h-4 w-4")} />
                </div>

                <span className="capitalize">
                  {option.label.split("_").join(" ")}
                </span>
                {facets?.get(option.value) && (
                  <span className="ml-auto flex h-4 w-5 items-center justify-center rounded bg-sky-700 font-mono text-xs">
                    {facets.get(option.value)}
                  </span>
                )}
              </CommandItem>
            )
          })}
        </CommandGroup>
        {selectedValues.size > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={() => column?.setFilterValue(undefined)}
                className="justify-center text-center text-xs"
              >
                Clear {title} filters
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </Command>
  )
}

export default DiscipleFilters
