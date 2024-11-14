"use client"

import { FormEvent, useState } from "react"
import { useSearchParams } from "next/navigation"
import { ChevronDownIcon, LayersIcon } from "lucide-react"
import { useAction } from "next-safe-action/hooks"

import { Option } from "@/types/common"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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
import { Label } from "@/components/ui/label"
import { NativeSelect } from "@/components/ui/native-select"
import { SubmitButton } from "@/components/ui/submit-button"
import { toast } from "@/components/ui/use-toast"

import { bulkUpdateDisciple } from "./actions"
import {
  cellStatuses,
  churchStatuses,
  processLevels,
  processLevelStatuses,
} from "./constants"

type BulkAction =
  | "cell_status"
  | "church_status"
  | "process_level"
  | "process_status"

const titleActionMap: Record<BulkAction, string> = {
  cell_status: "Update Cell Status",
  church_status: "Update Church Status",
  process_level: "Update Process Level",
  process_status: "Update Process Status",
}

const messageActionMap: Record<BulkAction, string> = {
  cell_status:
    "You are about to update the Cell Status of the selected disciples",
  church_status:
    "You are about to update the Church Status of the selected disciples",
  process_level:
    "You are about to update the Process Level of the selected disciples",
  process_status:
    "You are about to update the Process Level Status of the selected disciples",
}

const optionsActionMap: Record<BulkAction, Option[]> = {
  cell_status: cellStatuses,
  church_status: churchStatuses,
  process_level: processLevels,
  process_status: processLevelStatuses,
}

export function DiscipleBulkActions({
  selectedDisciples,
  onAfterSave,
  disableProcessStatus,
}: {
  selectedDisciples: string[]
  onAfterSave: () => void
  disableProcessStatus?: boolean
}) {
  const [action, setAction] = useState<BulkAction>()

  const [statusChangeDialogOpen, setStatusChangeDialogOpen] = useState(false)

  const bulkAction = useAction(bulkUpdateDisciple, {
    onError({ error }) {
      toast({
        title: "Something went wrong.",
        description:
          error.serverError ??
          "The disciple records was not updated. Please try again.",
        variant: "destructive",
      })
    },
    onSuccess() {
      toast({
        title: "Success!",
        description: "The disciples were updated successfully!",
        variant: "success",
      })
    },
  })

  const searchParams = useSearchParams()

  const status = searchParams.get("status")

  const forActive = status === "active" || !status

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    try {
      const form = new FormData(e.currentTarget)
      const values = Object.fromEntries(form.entries())

      if (action && !form.get(action)) return

      const result = await bulkAction.executeAsync({
        selectedIds: selectedDisciples,
        ...values,
        isActive:
          values?.isActive === "true"
            ? true
            : values.isActive === "false"
              ? false
              : undefined,
      })

      if (result?.data?.updated) {
        onAfterSave()
        setAction(undefined)
      }
    } catch (error) {}
  }

  const label = action?.split("_").join(" ")

  return (
    <div className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 items-center justify-between rounded-md border bg-background p-1 lg:flex">
      <div className="mr-3 shrink-0 border-r px-3 pl-2 text-sm text-muted-foreground">
        {selectedDisciples.length}{" "}
        {selectedDisciples.length > 1 ? "disciples" : "disciple"} selected
      </div>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="sm">
            <LayersIcon className="size-4" /> Bulk Actions{" "}
            <ChevronDownIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Bulk Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setAction("cell_status")}>
            Update Cell Status
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setAction("church_status")}>
            Update Church Status
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setAction("process_level")}>
            Update Process Level
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={disableProcessStatus}
            onClick={() => setAction("process_status")}
          >
            Update Process Status
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {forActive ? (
            <DropdownMenuItem
              onClick={() => setStatusChangeDialogOpen(true)}
              className="text-red-500 focus:text-red-500"
            >
              Make Inactive
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => setStatusChangeDialogOpen(true)}
              className="text-emerald-500 focus:text-emerald-500"
            >
              Make Active
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {action && (
        <AlertDialog
          open={Boolean(action)}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setAction(undefined)
            }
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{titleActionMap[action]}</AlertDialogTitle>
              <AlertDialogDescription>
                {messageActionMap[action]}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <form onSubmit={handleSubmit}>
              <fieldset disabled={bulkAction.isPending}>
                <Label
                  className="mb-2 inline-block capitalize"
                  htmlFor={action}
                >
                  {label}
                </Label>
                <NativeSelect defaultValue="" id={action} name={action}>
                  <option disabled value="" className="capitalize">
                    Select {label}
                  </option>
                  {optionsActionMap[action].map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      className="capitalize"
                    >
                      {option.label.split("_").join(" ")}
                    </option>
                  ))}
                </NativeSelect>
                <AlertDialogFooter className="pt-6">
                  <AlertDialogCancel
                    disabled={false}
                    onClick={() => setAction(undefined)}
                  >
                    Cancel
                  </AlertDialogCancel>
                  <SubmitButton loading={bulkAction.isPending}>
                    Confirm
                  </SubmitButton>
                </AlertDialogFooter>
              </fieldset>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <AlertDialog
        open={statusChangeDialogOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setStatusChangeDialogOpen(false)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Status</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                You are about to change the status of the selected disciples
                <div className="mt-1">
                  from{" "}
                  <Badge variant={forActive ? "ACTIVE" : "INACTIVE"}>
                    {forActive ? "Active" : "Inactive"}
                  </Badge>{" "}
                  to{" "}
                  <Badge variant={forActive ? "INACTIVE" : "ACTIVE"}>
                    {forActive ? "Inactive" : "Active"}
                  </Badge>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <form onSubmit={handleSubmit}>
            <fieldset disabled={bulkAction.isPending}>
              <Label
                className="sr-only mb-2 inline-block capitalize"
                htmlFor="isActive"
              >
                Status
              </Label>
              <input
                type="hidden"
                hidden
                name="isActive"
                id="isActive"
                defaultValue={forActive ? "false" : "true"}
              />
              <AlertDialogFooter className="pt-6">
                <AlertDialogCancel
                  disabled={false}
                  onClick={() => setAction(undefined)}
                >
                  Cancel
                </AlertDialogCancel>
                <SubmitButton loading={bulkAction.isPending}>
                  Confirm
                </SubmitButton>
              </AlertDialogFooter>
            </fieldset>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
