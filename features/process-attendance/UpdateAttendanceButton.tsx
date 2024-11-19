"use client"

import { LockIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export function UpdateAttendanceButton({
  id,
  label,
}: {
  id: string
  label: string
}) {
  return (
    <Button
      size="sm"
      variant="outline"
      className="h-full w-full rounded bg-muted/20 px-1.5"
    >
      {label} <LockIcon className="size-3 text-amber-500" />
    </Button>
    // <label
    //   htmlFor={`unlock-${id}`}
    //   className={cn(
    //     buttonVariants({ size: "sm", variant: "outline" }),
    //     "h-full w-full rounded bg-muted/20 px-1.5 align-middle has-[input:checked]:border-amber-400 has-[input:checked]:bg-amber-400/30"
    //   )}
    // >
    //   {label}
    //   <input hidden type="checkbox" id={`unlock-${id}`} name={`unlock-${id}`} />
    // </label>
  )
}
