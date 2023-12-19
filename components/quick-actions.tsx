"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDownIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function QuickActions() {
  const [open, setOpen] = useState(false)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button size="sm">
          Quick Actions <ChevronDownIcon className="ml-3 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Pick an Action</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup onClick={() => setOpen(false)}>
          <DropdownMenuItem>
            <Link href="/disciples/new" className="inline-block w-full">
              Add Disciple
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/cell-reports/new" className="inline-block w-full">
              Create Cell Report
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
