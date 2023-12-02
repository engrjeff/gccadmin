"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

export function DiscipleActivitySelect() {
  const searchParams = useSearchParams()

  const isActive = searchParams.get("isActive") === "false" ? false : true

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          {/* <TrendingUpIcon className="mr-2 h-4 w-4" /> */}
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[170px]">
        <DropdownMenuLabel>Show Active/Inactive</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="capitalize"
          defaultChecked={isActive}
          asChild
        >
          <Link href={{ pathname: "/disciples", query: { isActive: true } }}>
            Active
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="capitalize"
          defaultChecked={!isActive}
          asChild
        >
          <Link href={{ pathname: "/disciples", query: { isActive: false } }}>
            Inactive
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
