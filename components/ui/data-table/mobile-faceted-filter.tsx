import { Column } from "@tanstack/react-table"
import { Check, LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import { Button } from "../button"

interface DataTableFacetedFilter<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
  options: {
    label: string
    value: string
    icon?: LucideIcon
  }[]
}

export function MobileFacetedFilter<TData, TValue>({
  column,
  title,
  options,
}: DataTableFacetedFilter<TData, TValue>) {
  if (options.length === 0) return null

  const facets = column?.getFacetedUniqueValues()
  const selectedValues = new Set(column?.getFilterValue() as string[])

  return (
    <div>
      <p className="mb-2 text-sm font-medium">{title}</p>
      <ul className="space-y-0.5">
        {options.map((option) => {
          const isSelected = selectedValues.has(option.value)
          const optionValueCount = facets?.get(option.value)

          if (!optionValueCount) return null

          return (
            <li key={option.value}>
              <Button
                variant="ghost"
                className="flex w-full rounded-none"
                onClick={() => {
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
                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "opacity-50 [&_svg]:invisible"
                  )}
                >
                  <Check className={cn("h-4 w-4")} />
                </div>
                {option.icon && (
                  <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                )}
                <span className="capitalize">
                  {option.label.split("_").join(" ")}
                </span>
                {facets?.get(option.value) && (
                  <span className="ml-auto flex h-4 min-w-[20px] items-center justify-center rounded bg-primary px-0.5 font-mono text-xs font-medium text-primary-foreground">
                    {facets.get(option.value)}
                  </span>
                )}
              </Button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
