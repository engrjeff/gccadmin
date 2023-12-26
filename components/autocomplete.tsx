import React from "react"
import { CheckIcon, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface AutocompleteProps {
  placeholderText: string
  searchText: string
  value?: string
  onChange: (value: string) => void
  options: { label: string; value: string }[]
  disabled?: boolean
  error?: boolean
}

function Autocomplete({
  placeholderText,
  searchText,
  value,
  onChange,
  options,
  disabled,
  error,
}: AutocompleteProps) {
  const [open, setOpen] = React.useState(false)

  const selectedOption = options.find(
    (option) => option.value.toLowerCase() === value
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "h-10 w-full justify-between px-3 shadow-none ring-offset-background placeholder:text-muted-foreground hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            { "focus:ring-danger border-danger": error }
          )}
          disabled={disabled}
        >
          {value
            ? selectedOption
              ? selectedOption.label
              : placeholderText
            : placeholderText}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="max-h-[400px] w-[300px] overflow-y-auto p-0"
        align="start"
      >
        <Command
          filter={(value, search) => {
            if (
              options
                .find((i) => i.value === value)
                ?.label.toLowerCase()
                .includes(search.toLowerCase())
            )
              return 1
            return 0
          }}
        >
          <CommandInput placeholder={searchText} className="h-9" />
          <CommandEmpty>No option found.</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={(currentValue) => {
                  if (currentValue !== value) {
                    onChange(currentValue)
                  }
                  setOpen(false)
                }}
              >
                {option.label}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default Autocomplete
