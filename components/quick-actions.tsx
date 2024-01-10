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

export default function QuickActions() {
  const [open, setOpen] = useState(false)

  const isDesktop = useIsDesktop()

  if (isDesktop)
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

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size="sm">
          Quick Actions <ChevronDownIcon className="ml-3 h-4 w-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="pb-0">
          <DrawerTitle>Pick an Action</DrawerTitle>
        </DrawerHeader>
        <DrawerFooter className="px-2">
          <Link
            href="/disciples/new"
            className="flex w-full items-center gap-4 rounded-full px-1.5 py-1 text-sm focus:bg-neutral-900 focus-visible:bg-neutral-900 active:bg-neutral-900"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted shadow">
              <Users className="h-4 w-4" />
            </span>
            <span>Add Disciple</span>
          </Link>
          <Link
            href="/cell-reports/new"
            className="flex w-full items-center gap-4 rounded-full px-1.5 py-1 text-sm focus:bg-neutral-900 focus-visible:bg-neutral-900 active:bg-neutral-900"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted shadow">
              <StickyNote className="h-4 w-4" />
            </span>
            <span>Create Cell Report</span>
          </Link>
          <Link
            href="/cell-groups/new"
            className="pointer-events-none flex w-full items-center gap-4 rounded-full px-1.5 py-1 text-sm opacity-50 focus:bg-neutral-900 focus-visible:bg-neutral-900 active:bg-neutral-900"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted shadow">
              <Component className="h-4 w-4" />
            </span>
            <span>Create Cell Group</span>
          </Link>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
