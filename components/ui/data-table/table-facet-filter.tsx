"use client"

import { useState } from "react"
import { ChevronDown, PlusIcon } from "lucide-react"
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs"

import { cn, removeUnderscores } from "@/lib/utils"
import { usePageState } from "@/hooks/use-page-state"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

interface TableFacetFilterProps {
  title: string
  filterKey: string
  selectedLabelKey?: "label" | "value"
  options: {
    label: string
    value: string
  }[]
}

export function TableFacetFilter({
  filterKey,
  title,
  selectedLabelKey = "value",
  options,
}: TableFacetFilterProps) {
  const [queryParam, setQueryParam] = useQueryState(
    filterKey,
    parseAsArrayOf(parseAsString)
      .withDefault([])
      .withOptions({ shallow: false })
  )

  return (
    <FilterComponent
      key={queryParam.length.toString()}
      title={title}
      selectedLabelKey={selectedLabelKey}
      options={options}
      queryParam={queryParam}
      onApply={setQueryParam}
    />
  )
}

function FilterComponent({
  queryParam,
  title,
  options,
  selectedLabelKey,
  onApply,
}: Omit<TableFacetFilterProps, "filterKey"> & {
  queryParam: string[]
  onApply: (values: string[]) => void
}) {
  const [open, setOpen] = useState(false)

  const [selected, setSelected] = useState<string[]>(queryParam)

  const [page, setPage] = usePageState()

  const labels = selectedLabelKey
    ? options
        .filter((o) => selected.includes(o.value))
        .map((i) => i[selectedLabelKey])
    : selected

  return (
    <Popover
      open={open}
      modal
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setSelected(queryParam)
        }

        setOpen(isOpen)
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-10 justify-start rounded-lg px-2 md:h-8",
            selected.length === 0 ? "border-dashed" : ""
          )}
          type="button"
          disabled={false}
        >
          <PlusIcon className="h-4 w-4" />
          {title}
          {selected.length ? (
            <>
              <Separator orientation="vertical" className="mx-1 h-4" />
              <Badge
                variant="FILTER"
                className="rounded-sm px-1 font-normal capitalize"
              >
                {removeUnderscores(labels[0])}
                {selected.length > 1 ? (
                  <span className="pl-1.5 normal-case">
                    {" "}
                    +{selected.length - 1} more
                  </span>
                ) : null}
              </Badge>
            </>
          ) : null}
          <ChevronDown className="ml-auto h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[220px] rounded-lg p-2.5">
        <div className="mb-3 text-sm font-medium">Filter by {title}</div>
        {options.map((option) => (
          <div
            key={title + "-option-" + option.value}
            className="-ml-1 mb-0.5 flex items-center space-x-2 rounded-md px-1 py-1.5 hover:bg-muted"
          >
            <Checkbox
              id={option.value}
              checked={selected.includes(option.value)}
              onCheckedChange={(checked) =>
                setSelected((old) =>
                  checked
                    ? [...old, option.value]
                    : old.filter((i) => i !== option.value)
                )
              }
            />
            <label
              htmlFor={option.value}
              className="flex-1 text-sm font-medium capitalize leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {option.label}
            </label>
          </div>
        ))}

        <div className="mt-4 space-y-2">
          <Button
            type="button"
            size="sm"
            className="h-[30px] w-full"
            onClick={() => {
              onApply(selected)
              setOpen(false)

              if (page) {
                setPage(null)
              }
            }}
          >
            Apply
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-[30px] w-full"
            onClick={() => {
              setSelected([])
              onApply([])
            }}
          >
            Reset
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
