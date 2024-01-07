import { AriaAttributes, KeyboardEvent, useRef } from "react"
import { XMarkIcon } from "@heroicons/react/20/solid"

import { cn } from "@/lib/utils"

import { Badge, badgeVariants } from "./ui/badge"

interface TagsInputProps {
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  "aria-describedby"?: AriaAttributes["aria-describedby"]
  "aria-invalid"?: AriaAttributes["aria-invalid"]
}

function TagsInput({
  value,
  onChange,
  placeholder = "Type then press Enter",
  ...props
}: TagsInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    e.stopPropagation()

    if (e.key !== "Enter") return

    const val = e.currentTarget.value

    if (!val?.trim()) return

    if (value.some((v) => v.toLowerCase() === val.toLowerCase())) return

    onChange([...value, val.trim()])

    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  function removeTag(index: number) {
    onChange(value.filter((val, i) => i !== index))
  }

  return (
    <div className="relative flex min-h-[48px] flex-wrap items-center gap-2 rounded-md border border-input p-2 pr-20 ring-offset-background md:min-h-[40px] [&:has(input:focus-visible)]:ring-2 [&:has(input:focus-visible)]:ring-ring [&:has(input:focus-visible)]:ring-offset-2 [&:has(input[aria-invalid=true])]:border-danger [&:has(input[aria-invalid=true])]:ring-danger">
      {value.map((tag, index) => (
        <Badge
          key={`${tag}-${index}`}
          variant="secondary"
          className="text-sm font-normal"
        >
          {tag}{" "}
          <button
            type="button"
            className="ml-2"
            aria-label={`remove ${tag}`}
            onClick={() => removeTag(index)}
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </Badge>
      ))}

      <input
        type="text"
        hidden
        defaultValue={value.join(",")}
        aria-describedby={props["aria-describedby"]}
        aria-invalid={props["aria-invalid"]}
      />
      <input
        ref={inputRef}
        placeholder={placeholder}
        className="flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-muted-foreground"
        onKeyDown={handleKeyDown}
        form="unknown"
      />
      {value.length > 0 ? (
        <button
          type="button"
          onClick={() => onChange([])}
          className={cn(
            badgeVariants({ variant: "secondary" }),
            "absolute right-2 top-2 rounded border-none text-sm focus:ring-offset-0"
          )}
        >
          Clear
        </button>
      ) : null}
    </div>
  )
}

export default TagsInput
