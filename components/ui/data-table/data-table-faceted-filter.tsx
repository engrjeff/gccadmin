"use client"

import { Column } from "@tanstack/react-table"
import { Check } from "lucide-react"

import { Option } from "@/types/common"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

interface DataTableFacetedFilter<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
  hasSearch?: boolean
  options: Option[]
}

export function DataTableFacetedFilter<TData, TValue>({
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
