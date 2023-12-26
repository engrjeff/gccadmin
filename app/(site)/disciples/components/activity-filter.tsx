"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function ActivityFilter() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const state = searchParams.get("active")

  const updateURLQuery = (value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set("active", value)

    const updatedUrl = `${pathname}?${params.toString()}`

    router.push(updatedUrl)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          {state === "false" ? "Inactive" : "Active"}
          <ChevronDown className="ml-3 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuCheckboxItem
          className="capitalize"
          checked={state !== "false"}
          onCheckedChange={(value) => {
            if (!value) return
            updateURLQuery("true")
          }}
        >
          Active
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          className="capitalize"
          checked={state === "false"}
          onCheckedChange={(value) => {
            if (!value) return
            updateURLQuery("false")
          }}
        >
          Inactive
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ActivityFilter
