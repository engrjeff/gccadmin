"use client"

import { useState } from "react"
import { PlusCircleIcon } from "lucide-react"

import { useIsAdmin } from "@/hooks/use-isadmin"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { AttendancePeriodForm } from "./AttendancePeriodForm"

export function ProcessAttendancePeriodAddModal() {
  const [open, setOpen] = useState(false)

  const { isAdmin } = useIsAdmin()

  if (!isAdmin) return null

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm">
          <PlusCircleIcon className="h-4 w-4" /> Add Period
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="inset-y-2 right-2 flex h-auto w-[95%] flex-col gap-0 overflow-y-hidden rounded-lg border bg-background p-0 focus-visible:outline-none sm:max-w-lg"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader className="space-y-1 border-b p-4 text-left">
          <SheetTitle>Add Process Attendance Period</SheetTitle>
          <SheetDescription>Fill in the details below.</SheetDescription>
        </SheetHeader>
        <AttendancePeriodForm onAfterSave={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}
