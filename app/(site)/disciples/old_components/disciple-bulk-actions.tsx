"use client"

import { FormEventHandler, useState } from "react"
import { useRouter } from "next/navigation"
import { type Table } from "@tanstack/react-table"
import { ArrowUpRight, ChevronDown } from "lucide-react"

import { type Option } from "@/types/common"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

import { cellStatuses, churchStatuses, processLevels } from "../constants"
import { type DiscipleWithLeader } from "./columns"

interface DiscipleBulkActionsProps {
  table: Table<DiscipleWithLeader>
}

type BulkAction = "cell_status" | "church_status" | "process_level"

const titleActionMap: Record<BulkAction, string> = {
  cell_status: "Update Cell Status",
  church_status: "Update Church Status",
  process_level: "Update Process Level",
}

const messageActionMap: Record<BulkAction, string> = {
  cell_status:
    "You are about to update the Cell Status of the selected disciples",
  church_status:
    "You are about to update the Church Status of the selected disciples",
  process_level:
    "You are about to update the Process Level of the selected disciples",
}

const optionsActionMap: Record<BulkAction, Option[]> = {
  cell_status: cellStatuses,
  church_status: churchStatuses,
  process_level: processLevels,
}

function DiscipleBulkActions({ table }: DiscipleBulkActionsProps) {
  const router = useRouter()
  const [action, setAction] = useState<BulkAction | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const selectedIds = table
    .getSelectedRowModel()
    .rows.map((row) => row.original.id)

  if (selectedIds.length === 0) return null

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    setIsLoading(true)

    const form = new FormData(e.currentTarget)
    const values = Object.fromEntries(form.entries())

    const response = await fetch("/api/disciples", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...values, selectedIds }),
    })

    setIsLoading(false)

    if (!response?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "The disciple records was not updated. Please try again.",
        variant: "destructive",
      })
    }
    toast({
      title: "Success!",
      description: "The disciples were updated successfully!",
      variant: "success",
    })
    router.refresh()

    setAction(null)
  }

  const label = action?.split("_").join(" ")

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-8">
            <span>Bulk Actions</span>
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Button
              variant="ghost"
              className="h-8 w-full justify-start"
              onClick={() => setAction("cell_status")}
            >
              <ArrowUpRight className="mr-2 h-4 w-4" />
              <span>Update Cell Status</span>
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Button
              variant="ghost"
              className="h-8 w-full justify-start"
              onClick={() => setAction("church_status")}
            >
              <ArrowUpRight className="mr-2 h-4 w-4" />
              <span>Update Church Status</span>
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Button
              variant="ghost"
              className="h-8 w-full justify-start"
              onClick={() => setAction("process_level")}
            >
              <ArrowUpRight className="mr-2 h-4 w-4" />
              <span>Update Process Level</span>
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {action !== null && (
        <AlertDialog open={action !== null}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{titleActionMap[action]}</AlertDialogTitle>
              <AlertDialogDescription>
                {messageActionMap[action]}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <form onSubmit={handleSubmit}>
              <Label className="mb-2 inline-block capitalize" htmlFor={action}>
                {label}
              </Label>
              <Select disabled={isLoading} name={action}>
                <SelectTrigger className="mb-4 w-full capitalize">
                  <SelectValue placeholder={label} className="capitalize" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel className="capitalize">
                      Select {label}
                    </SelectLabel>
                    {optionsActionMap[action].map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label.split("_").join(" ")}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <AlertDialogFooter>
                <AlertDialogCancel
                  disabled={isLoading}
                  onClick={() => setAction(null)}
                >
                  Cancel
                </AlertDialogCancel>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update"}
                </Button>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  )
}

export default DiscipleBulkActions
