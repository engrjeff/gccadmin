"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDownIcon } from "@radix-ui/react-icons"
import { Component, StickyNote, Users } from "lucide-react"

import useIsDesktop from "@/hooks/use-is-desktop"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { BottomsheetLink, BottomsheetLinkIcon } from "./bottomsheet-link"

export default function QuickActions() {
  const [open, setOpen] = useState(false)

  const isDesktop = useIsDesktop()

  if (isDesktop)
    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button size="sm">
            Quick Actions <ChevronDownIcon className="ml-3 h-5 w-5" />
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

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size="sm">
          Quick Actions <ChevronDownIcon className="ml-3 h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="pb-0">
          <DrawerTitle>Pick an Action</DrawerTitle>
        </DrawerHeader>
        <DrawerFooter className="px-2">
          <BottomsheetLink href="/disciples/new">
            <BottomsheetLinkIcon>
              <Users className="h-5 w-5" />
            </BottomsheetLinkIcon>
            <span>Add Disciple</span>
          </BottomsheetLink>
          <BottomsheetLink href="/cell-reports/new">
            <BottomsheetLinkIcon>
              <StickyNote className="h-5 w-5" />
            </BottomsheetLinkIcon>
            <span>Create Cell Report</span>
          </BottomsheetLink>
          <BottomsheetLink
            href="/cell-groups/new"
            className="pointer-events-none cursor-not-allowed opacity-50"
          >
            <BottomsheetLinkIcon>
              <Component className="h-5 w-5" />
            </BottomsheetLinkIcon>
            <span>Create Cell Group</span>
          </BottomsheetLink>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
