"use client"

import { useState } from "react"
import {
  EyeIcon,
  MoreHorizontalIcon,
  PencilIcon,
  RotateCcwIcon,
  RotateCwIcon,
  TrashIcon,
} from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
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
  onOpen,
}: {
  disciple: DiscipleWithLeader
  onOpen: () => void
}) {
  const [action, setAction] = useState<RowAction>()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [open, setOpen] = useState(false)

  const isMobile = useIsMobile()

  function handleDrawerItemClick(actionName: RowAction) {
    setAction(actionName)
    setDrawerOpen(false)
  }

  function handleDropdownItemClick(actionName: RowAction) {
    setAction(actionName)
    setOpen(false)
  }

  return (
    <>
      {isMobile ? (
        <Drawer
          open={drawerOpen}
          onOpenChange={(isOpen) => {
            if (isOpen) onOpen()
            setDrawerOpen(isOpen)
          }}
          shouldScaleBackground={false}
        >
          <DrawerTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 hover:border hover:bg-muted/30"
            >
              <span className="sr-only">Actions</span>
              <MoreHorizontalIcon className="size-4" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="inset-x-2">
            <DrawerHeader className="mb-2 gap-1 border-b text-left">
              <DrawerTitle className="text-sm font-semibold">
                Actions
              </DrawerTitle>
              <DrawerDescription>{disciple.name}</DrawerDescription>
            </DrawerHeader>
            <div className="flex flex-col gap-2 px-2 pb-4">
              <Button
                className="justify-start px-2 text-left"
                variant="ghost"
                onClick={() => handleDrawerItemClick("view")}
              >
                <EyeIcon size={16} /> View
              </Button>
              <Button
                className="justify-start px-2 text-left"
                variant="ghost"
                onClick={() => handleDrawerItemClick("edit")}
              >
                <PencilIcon size={16} /> Edit
              </Button>
              {!disciple.isActive ? (
                <Button
                  className="justify-start px-2 text-left"
                  variant="ghost"
                  onClick={() => handleDrawerItemClick("make-active")}
                >
                  <RotateCwIcon size={16} /> Make Active
                </Button>
              ) : null}
              {disciple.isActive ? (
                <Button
                  className="justify-start px-2 text-left"
                  variant="ghost"
                  onClick={() => handleDrawerItemClick("make-inactive")}
                >
                  <RotateCcwIcon size={16} /> Make Inactive
                </Button>
              ) : null}
              <Button
                className="justify-start px-2 text-left text-red-500 hover:text-red-500"
                variant="ghost"
                onClick={() => handleDrawerItemClick("delete")}
              >
                <TrashIcon size={16} /> Delete
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <DropdownMenu
          modal={false}
          open={open}
          onOpenChange={(isOpen) => {
            if (isOpen) onOpen()
            setOpen(isOpen)
          }}
        >
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
      )}

      <Sheet
        open={action === "edit"}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setAction(undefined)
            setDrawerOpen(false)
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
            setDrawerOpen(false)
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
                className="mt-0 max-h-[calc(100dvh-140px)] flex-1 overflow-y-auto pb-2"
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
                className="mt-0 max-h-[calc(100dvh-140px)] flex-1 overflow-y-auto pb-2"
              >
                <LessonsTakenByDisciple discipleId={disciple.id} />
              </TabsContent>
              <TabsContent
                value="cell-groups"
                className="mt-0 max-h-[calc(100dvh-140px)] flex-1 overflow-y-auto pb-2"
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
            setDrawerOpen(false)
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
            setDrawerOpen(false)
          }
        }}
      />
    </>
  )
}
