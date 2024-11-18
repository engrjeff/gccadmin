"use client"

import { useState } from "react"
import { ListFilterIcon } from "lucide-react"
import { parseAsString, useQueryState } from "nuqs"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function ColumnFilter({
  title,
  filterKey,
  options,
}: {
  title: string
  filterKey: string
  options: Array<{ label: string; value: string }>
}) {
  const [filter, setFilter] = useQueryState(
    filterKey,
    parseAsString.withOptions({ shallow: false })
  )

  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="h-full w-full justify-between rounded bg-muted/20 px-1.5"
        >
          {filter ? options.find((o) => o.value === filter)?.label : title}{" "}
          <ListFilterIcon className="size-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="min-w-[180px] rounded-lg p-2.5">
        <div className="mb-3 text-sm font-medium">Filter by {title}</div>
        {options.map((option) => (
          <div
            key={title + "-option-" + option.value}
            className="-ml-1 mb-0.5 flex items-center space-x-2 rounded-md px-1 hover:bg-muted"
          >
            <Checkbox
              id={option.value}
              disabled
              // checked={option.value === filter}
              // onCheckedChange={(isChecked) => {
              //   if (isChecked === true) {
              //     setFilter(option.value)
              //   } else {
              //     setFilter(null)
              //   }
              // }}
            />
            <label
              htmlFor={option.value}
              className="flex-1 py-1.5 text-sm font-medium capitalize leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {option.label}
            </label>
          </div>
        ))}
        <div className="mt-3 space-y-2">
          <Button
            type="button"
            size="sm"
            className="h-8 w-full"
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 w-full bg-muted/30"
            onClick={() => setFilter(null)}
          >
            Reset
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
