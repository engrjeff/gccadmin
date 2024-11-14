"use client"

import { useState } from "react"
import { MoreHorizontalIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { AttendedCellGroups } from "./AttendedCellGroups"
import { DiscipleWithLeader } from "./columns"
import { DiscipleAccountActions } from "./DiscipleAccountActions"
import { DiscipleChangeActiveStatusDialog } from "./DiscipleChangeActiveStatusDialog"
import { DiscipleDeleteDialog } from "./DiscipleDeleteDialog"
import { DiscipleDetails } from "./DiscipleDetails"
import { DiscipleEditForm } from "./DiscipleEditForm"
import { LessonsTakenByDisciple } from "./LessonsTakenByDisciple"

type RowAction = "edit" | "view" | "make-inactive" | "make-active" | "delete"

export function DiscipleRowActions({
  disciple,
}: {
  disciple: DiscipleWithLeader
}) {
  const [action, setAction] = useState<RowAction>()

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 hover:border hover:bg-muted/30"
          >
            <span className="sr-only">Actions</span>
            <MoreHorizontalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setAction("view")}>
            View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setAction("edit")}>
            Edit
          </DropdownMenuItem>
          {!disciple.isActive ? (
            <DropdownMenuItem onClick={() => setAction("make-active")}>
              Make Active
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuSeparator />
          {disciple.isActive ? (
            <DropdownMenuItem onClick={() => setAction("make-inactive")}>
              Make Inactive
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuItem
            onClick={() => setAction("delete")}
            className="text-red-500 focus:text-red-500"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
          <SheetHeader className="space-y-1 border-b p-4 text-left">
            <SheetTitle>Update Disciple</SheetTitle>
            <SheetDescription>Fill in the details below.</SheetDescription>
          </SheetHeader>
          <DiscipleEditForm
            disciple={disciple}
            onAfterSave={() => setAction(undefined)}
          />
        </SheetContent>
      </Sheet>

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
          onInteractOutside={(e) => e.preventDefault()}
        >
          <SheetHeader className="space-y-1 border-b p-4 text-left">
            <SheetTitle>Disciple Details</SheetTitle>
            <div className="flex items-center justify-between">
              <SheetDescription>
                Quick details for{" "}
                <span className="font-semibold">{disciple.name}</span>.
              </SheetDescription>
              <Badge variant={disciple.isActive ? "ACTIVE" : "INACTIVE"}>
                {disciple.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </SheetHeader>
          <div className="flex-1">
            <Tabs defaultValue="details" className="h-full w-full">
              <TabsList className="h-auto w-full justify-start rounded-none border-b bg-transparent px-4 py-0">
                <TabsTrigger
                  value="details"
                  className="-mb-px rounded-none border-b-2 border-transparent p-3 hover:border-gray-500 data-[state=active]:border-foreground"
                >
                  Details
                </TabsTrigger>
                <TabsTrigger
                  value="lessons-taken"
                  className="-mb-px rounded-none border-b-2 border-transparent p-3 hover:border-gray-500 data-[state=active]:border-foreground"
                >
                  Lessons Taken
                </TabsTrigger>
                <TabsTrigger
                  value="cell-groups"
                  className="-mb-px rounded-none border-b-2 border-transparent p-3 hover:border-gray-500 data-[state=active]:border-foreground"
                >
                  Cell Groups
                </TabsTrigger>
              </TabsList>
              <TabsContent
                value="details"
                className="mt-0 max-h-[80vh] overflow-y-auto pb-2"
              >
                <DiscipleDetails disciple={disciple}>
                  <DiscipleAccountActions
                    onAfterSave={() => setAction(undefined)}
                    disciple={disciple}
                  />
                </DiscipleDetails>
              </TabsContent>
              <TabsContent
                value="lessons-taken"
                className="mt-0 max-h-[80vh] overflow-y-auto pb-2"
              >
                <LessonsTakenByDisciple discipleId={disciple.id} />
              </TabsContent>
              <TabsContent
                value="cell-groups"
                className="mt-0 max-h-[80vh] overflow-y-auto pb-2"
              >
                <AttendedCellGroups discipleId={disciple.id} />
              </TabsContent>
            </Tabs>
          </div>
        </SheetContent>
      </Sheet>

      <DiscipleDeleteDialog
        discipleName={disciple.name}
        discipleId={disciple.id}
        open={action === "delete"}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setAction(undefined)
          }
        }}
      />

      <DiscipleChangeActiveStatusDialog
        discipleName={disciple.name}
        discipleId={disciple.id}
        isActive={disciple.isActive}
        open={
          disciple.isActive
            ? action === "make-inactive"
            : action === "make-active"
        }
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setAction(undefined)
          }
        }}
      />
    </>
  )
}
