"use client"

import { useState } from "react"
import { PencilIcon } from "lucide-react"

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

import { EncounterBatchEditForm } from "./EncounterBatchEditForm"
import { EncounterBatchRecord } from "./types"

export function EncounterBatchEditModal({
  batch,
}: {
  batch: EncounterBatchRecord
}) {
  const [open, setOpen] = useState(false)

  const { isAdmin } = useIsAdmin()

  if (!isAdmin) return null

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="size-7"
          aria-label="Update batch"
        >
          <PencilIcon />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="inset-y-2 right-2 flex h-auto w-[95%] flex-col gap-0 overflow-y-hidden rounded-lg border bg-background p-0 focus-visible:outline-none sm:max-w-lg"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader className="space-y-1 border-b p-4 text-left">
          <SheetTitle>Update Encounter Batch</SheetTitle>
          <SheetDescription>Fill in the details below.</SheetDescription>
        </SheetHeader>
        <EncounterBatchEditForm
          batch={batch}
          onAfterSave={() => setOpen(false)}
        />
      </SheetContent>
    </Sheet>
  )
}
