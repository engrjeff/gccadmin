"use client"

import { useState } from "react"
import { Disciple } from "@prisma/client"
import { PlusCircleIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { AttendanceRecordForm } from "./AttendanceRecordForm"

export function ProcessAttendanceAddButton({
  label,
  processLessonId,
  processAttendancePeriodId,
  students,
}: {
  label?: string
  processLessonId: string
  processAttendancePeriodId: string
  students: Disciple[]
}) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="h-full w-full rounded bg-muted/20 px-1.5"
        >
          {label} <PlusCircleIcon className="size-3" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="inset-y-2 right-2 flex h-auto w-[95%] flex-col gap-0 overflow-y-hidden rounded-lg border bg-background p-0 focus-visible:outline-none sm:max-w-lg"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader className="space-y-1 border-b p-4 text-left">
          <SheetTitle>{label}</SheetTitle>
          <SheetDescription>Attendance record for {label}</SheetDescription>
        </SheetHeader>
        <AttendanceRecordForm
          processLessonId={processLessonId}
          processAttendancePeriodId={processAttendancePeriodId}
          students={students}
          onAfterSave={() => setOpen(false)}
        />
      </SheetContent>
    </Sheet>
  )
}
