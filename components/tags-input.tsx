import { AriaAttributes, KeyboardEvent, useRef } from "react"
import { XMarkIcon } from "@heroicons/react/20/solid"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import { Badge, badgeVariants } from "./ui/badge"

interface TagsInputProps {
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  hintText?: string
  "aria-describedby"?: AriaAttributes["aria-describedby"]
  "aria-invalid"?: AriaAttributes["aria-invalid"]
}

function TagsInput({
  value,
  onChange,
  hintText,
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
    <div>
      <div className="relative flex min-h-[80px] flex-wrap items-start gap-2 rounded-md border border-input bg-muted/30 p-2 lg:pr-20 [&:has(input:focus-visible)]:ring-2 [&:has(input:focus-visible)]:ring-ring [&:has(input[aria-invalid=true])]:border-danger [&:has(input[aria-invalid=true])]:ring-danger">
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
          className="flex-1 bg-transparent px-1 py-px text-sm outline-none placeholder:text-muted-foreground"
          onKeyDown={handleKeyDown}
          form="unknown"
        />
        {value.length > 0 ? (
          <button
            type="button"
            onClick={() => onChange([])}
            className={cn(
              badgeVariants({ variant: "secondary" }),
              "absolute right-2 top-2 rounded-full border-none p-0.5 text-sm focus:ring-offset-0 lg:rounded lg:px-2"
            )}
          >
            <span className="sr-only lg:not-sr-only">Clear</span>
            <XIcon className="h-4 w-4 lg:hidden" />
          </button>
        ) : null}
      </div>
      {hintText ? (
        <span className="text-xs text-muted-foreground">{hintText}</span>
      ) : null}
    </div>
  )
}

export default TagsInput
