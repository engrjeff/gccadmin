"use client"

import { CircleDashedIcon, FlameIcon } from "lucide-react"
import { useQueryState } from "nuqs"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function EncounterBatchActiveFilter() {
  const [selectedValue, setSelectedValue] = useQueryState("memberStatus", {
    shallow: false,
    defaultValue: "active",
  })

  return (
    <div className="flex flex-col">
      <Label htmlFor="member-status" className="sr-only">
        Member Status
      </Label>
      <div className="inline-flex h-9 w-full rounded-lg bg-input/50 p-0.5">
        <RadioGroup
          name="member-status"
          value={selectedValue}
          onValueChange={(val) => {
            if (val === "off") {
              setSelectedValue("inactive")
            } else {
              setSelectedValue("active")
            }
          }}
          className="group relative inline-grid w-full grid-cols-[1fr_1fr] items-center gap-0 text-sm font-medium after:absolute after:inset-y-0 after:w-1/2 after:rounded-md after:bg-background after:shadow-sm after:shadow-black/5 after:ring-offset-background after:transition-transform after:duration-300 after:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] has-[:focus-visible]:after:ring-2 has-[:focus-visible]:after:ring-ring has-[:focus-visible]:after:ring-offset-2 data-[state=off]:after:translate-x-0 data-[state=on]:after:translate-x-full"
          data-state={selectedValue === "active" ? "off" : "on"}
        >
          <label className="relative z-10 inline-flex h-full min-w-8 cursor-pointer items-center justify-center whitespace-nowrap px-4 group-data-[state=on]:text-muted-foreground/70">
            <FlameIcon className="mr-2 size-4 text-orange-500" /> Active
            <RadioGroupItem value="on" className="sr-only" />
          </label>
          <label className="relative z-10 inline-flex h-full min-w-8 cursor-pointer items-center justify-center whitespace-nowrap px-4 group-data-[state=off]:text-muted-foreground/70">
            <CircleDashedIcon className="mr-2 size-4 text-red-500" /> Inactive{" "}
            <RadioGroupItem value="off" className="sr-only" />
          </label>
        </RadioGroup>
      </div>
    </div>
  )
}
