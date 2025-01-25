"use client"

import { ReactNode, useState } from "react"
import {
  CellStatus,
  ChurchStatus,
  Disciple,
  ProcessLevel,
} from "@prisma/client"

import { removeUnderscores } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function ViewDisciples({ disciples }: { disciples: Disciple[] }) {
  const firstTimers = disciples.filter(
    (d) => d.cell_status === CellStatus.FIRST_TIMER
  ).length
  const secondTimers = disciples.filter(
    (d) => d.cell_status === CellStatus.SECOND_TIMER
  ).length
  const thirdTimers = disciples.filter(
    (d) => d.cell_status === CellStatus.THIRD_TIMER
  ).length
  const cgRegulars = disciples.filter(
    (d) => d.cell_status === CellStatus.REGULAR
  ).length

  const nacs = disciples.filter(
    (d) => d.church_status === ChurchStatus.NACS
  ).length
  const acs = disciples.filter(
    (d) => d.church_status === ChurchStatus.ACS
  ).length
  const churchRegulars = disciples.filter(
    (d) => d.church_status === ChurchStatus.REGULAR
  ).length

  const enc = disciples.filter(
    (d) => d.process_level === ProcessLevel.ENCOUNTER
  ).length

  const preenc = disciples.filter(
    (d) => d.process_level === ProcessLevel.PREENC
  ).length

  const lead1 = disciples.filter(
    (d) => d.process_level === ProcessLevel.LEADERSHIP_1
  ).length

  const lead2 = disciples.filter(
    (d) => d.process_level === ProcessLevel.LEADERSHIP_2
  ).length

  const lead3 = disciples.filter(
    (d) => d.process_level === ProcessLevel.LEADERSHIP_3
  ).length

  const notInProcess = disciples.filter(
    (d) => d.process_level === ProcessLevel.NONE
  ).length

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="link" className="text-blue-500">
          View
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="inset-y-2 right-2 flex h-auto w-[95%] flex-col gap-0 overflow-y-hidden rounded-lg border bg-background p-0 focus-visible:outline-none sm:max-w-lg"
      >
        <SheetHeader className="border-b p-4 text-left">
          <SheetTitle>Disciples ({disciples.length})</SheetTitle>
          <div className="flex items-center justify-between">
            <SheetDescription>Cell Group attendees</SheetDescription>
          </div>
        </SheetHeader>

        <div className="max-h-[calc(100%-69px)] flex-1 overflow-y-auto py-4">
          <div className="px-4 text-sm">
            <Stats>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <dl className="space-y-2">
                  <dt className="mb-2 font-semibold">Cell Status</dt>
                  <dd>
                    <Badge variant={CellStatus.FIRST_TIMER}>
                      1st Timer: {firstTimers}
                    </Badge>
                  </dd>
                  <dd>
                    <Badge variant={CellStatus.SECOND_TIMER}>
                      2nd Timer: {secondTimers}
                    </Badge>
                  </dd>
                  <dd>
                    <Badge variant={CellStatus.THIRD_TIMER}>
                      3rd Timer: {thirdTimers}
                    </Badge>
                  </dd>
                  <dd>
                    <Badge variant={CellStatus.REGULAR}>
                      Regular: {cgRegulars}
                    </Badge>
                  </dd>
                </dl>

                <dl className="space-y-2">
                  <dt className="mb-2 font-semibold">Church Status</dt>
                  <dd>
                    <Badge variant={ChurchStatus.NACS}>NACS: {nacs}</Badge>
                  </dd>
                  <dd>
                    <Badge variant={ChurchStatus.ACS}>ACS: {acs}</Badge>
                  </dd>
                  <dd>
                    <Badge variant={ChurchStatus.REGULAR}>
                      Regular: {churchRegulars}
                    </Badge>
                  </dd>
                </dl>

                <dl className="space-y-2">
                  <dt className="mb-2 font-semibold">Process</dt>
                  <dd>
                    <Badge variant={ProcessLevel.ENCOUNTER}>
                      ENC Grad: {enc}
                    </Badge>
                  </dd>
                  <dd>
                    <Badge variant={ProcessLevel.PREENC}>
                      Pre-Enc: {preenc}
                    </Badge>
                  </dd>
                  <dd>
                    <Badge variant={ProcessLevel.LEADERSHIP_1}>
                      Leadership 1: {lead1}
                    </Badge>
                  </dd>
                  <dd>
                    <Badge variant={ProcessLevel.LEADERSHIP_2}>
                      Leadership 2: {lead2}
                    </Badge>
                  </dd>
                  <dd>
                    <Badge variant={ProcessLevel.LEADERSHIP_3}>
                      Leadership 3: {lead3}
                    </Badge>
                  </dd>
                  <dd>
                    <Badge variant={ProcessLevel.NONE}>
                      Not in Process: {notInProcess}
                    </Badge>
                  </dd>
                </dl>
              </div>
            </Stats>

            <Separator className="mt-3" />
            <ul>
              {disciples.map((d, idx) => (
                <li key={d.id} className="py-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {idx + 1}
                    </span>
                    <p className="text-sm">{d.name}</p>
                    <div className="ml-3 w-full space-x-2">
                      <Badge variant={d.cell_status}>
                        Cell: {removeUnderscores(d.cell_status)}
                      </Badge>
                      <Badge variant={d.church_status}>
                        Church: {removeUnderscores(d.church_status)}
                      </Badge>
                      <Badge variant={d.process_level}>
                        Process: {removeUnderscores(d.process_level)}
                      </Badge>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <SheetFooter className="mt-auto flex gap-3 border-t p-4 text-right">
          <SheetClose asChild>
            <Button type="button" variant="outline" className="bg-muted/30">
              Close
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function Stats({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button size="sm" variant="secondary">
          {open ? "Hide" : "Show"} Stats
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>{children}</CollapsibleContent>
    </Collapsible>
  )
}
