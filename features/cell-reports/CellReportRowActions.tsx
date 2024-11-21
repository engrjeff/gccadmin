"use client"

import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

import { CellReportDetails } from "./CellReportDetails"
import { CellReportEditForm } from "./CellReportEditForm"
import { CellReportRecord } from "./types"

type RowAction = "edit" | "view"

export function CellReportRowActions({
  cellReport,
}: {
  cellReport: CellReportRecord
}) {
  const [action, setAction] = useState<RowAction>()

  return (
    <>
      <div className="-ml-4 flex justify-start lg:ml-0 lg:justify-center">
        <Button
          variant="link"
          className="text-blue-500"
          onClick={() => setAction("view")}
        >
          View
        </Button>
        <Button
          variant="link"
          className="text-blue-500"
          onClick={() => setAction("edit")}
        >
          Edit
        </Button>
      </div>

      <Sheet
        open={action === "view"}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setAction(undefined)
          }
        }}
      >
        <SheetContent
          side="right"
          className="inset-y-2 right-2 flex h-auto w-[95%] flex-col gap-0 overflow-y-hidden rounded-lg border bg-background p-0 focus-visible:outline-none sm:max-w-lg"
        >
          <SheetHeader className="border-b p-4 text-left">
            <SheetTitle>Cell Report Details</SheetTitle>
            <div className="flex items-center justify-between">
              <SheetDescription>
                Information about this cell report.
              </SheetDescription>
              <Badge variant={cellReport.type}>{cellReport.type}</Badge>
            </div>
          </SheetHeader>

          <div className="max-h-[calc(100%-69px)] flex-1 overflow-y-auto py-4">
            <CellReportDetails cellReport={cellReport} />
          </div>

          <SheetFooter className="mt-auto flex gap-3 border-t p-4 text-right">
            <SheetClose asChild>
              <Button type="button" variant="outline" className="bg-muted/30">
                Close
              </Button>
            </SheetClose>
            <Button type="button" onClick={() => setAction("edit")}>
              Edit Report
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet
        open={action === "edit"}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setAction(undefined)
          }
        }}
      >
        <SheetContent
          side="right"
          className="inset-y-2 right-2 flex h-auto w-[95%] flex-col gap-0 overflow-y-hidden rounded-lg border bg-background p-0 focus-visible:outline-none sm:max-w-lg"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <SheetHeader className="border-b p-4">
            <SheetTitle>Edit Cell Report</SheetTitle>
            <SheetDescription>Fill in the details below.</SheetDescription>
          </SheetHeader>
          <CellReportEditForm
            cellReport={cellReport}
            onAfterSave={() => setAction(undefined)}
          />
        </SheetContent>
      </Sheet>
    </>
  )
}
