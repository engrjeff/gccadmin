"use client"

import { useState } from "react"
import Link from "next/link"
import { CellReportForm } from "@/features/cell-reports/CellReportForm"
import { DiscipleForm } from "@/features/disciples/DiscipleForm"
import { ChevronsUpDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

import Logo from "./logo"

type QuickAction = "create-report" | "add-disciple" | "go-to-process"

export function AppQuickActions() {
  const [action, setAction] = useState<QuickAction>()

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="h-12 w-full justify-start border-transparent bg-transparent p-2 text-left text-foreground lg:h-14 lg:border-input"
          >
            <Logo size={32} />
            <span className="mt-0.5 inline-block font-semibold">GCC Admin</span>
            <ChevronsUpDownIcon className="ml-auto size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[200px]">
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
            Quick Actions
          </DropdownMenuLabel>
          <DropdownMenuItem
            className="py-2"
            onClick={() => setAction("create-report")}
          >
            Create Cell Report
          </DropdownMenuItem>
          <DropdownMenuItem
            className="py-2"
            onClick={() => setAction("add-disciple")}
          >
            Add Disciple
          </DropdownMenuItem>
          <DropdownMenuItem className="py-2" asChild>
            <Link href="/process-attendance">Go To Process</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Sheet
        open={action === "add-disciple"}
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
          <SheetHeader className="space-y-1 border-b p-4 text-left">
            <SheetTitle>Add Disciple</SheetTitle>
            <SheetDescription>Fill in the details below.</SheetDescription>
          </SheetHeader>
          <DiscipleForm onAfterSave={() => setAction(undefined)} />
        </SheetContent>
      </Sheet>
      <Sheet
        open={action === "create-report"}
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
          <SheetHeader className="space-y-1 border-b p-4 text-left">
            <SheetTitle>Create Cell Report</SheetTitle>
            <SheetDescription>Fill in the details below.</SheetDescription>
          </SheetHeader>
          <CellReportForm onAfterSave={() => setAction(undefined)} />
        </SheetContent>
      </Sheet>
    </>
  )
}
