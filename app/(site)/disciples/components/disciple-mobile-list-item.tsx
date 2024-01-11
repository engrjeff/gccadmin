"use client"

import { useState } from "react"
import Link from "next/link"
import { Book, Edit, Eye, MoreVertical, Users } from "lucide-react"

import { useIsAdmin } from "@/hooks/use-isadmin"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

import { type DiscipleWithLeader } from "./columns"

function DiscipleMobileListItem({
  disciple,
}: {
  disciple: DiscipleWithLeader
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { isAdmin } = useIsAdmin()

  return (
    <div className="relative">
      <span className="sr-only">View {disciple.name}</span>
      <Card className="rounded px-3 py-2 ">
        <div className="mb-2 space-y-1">
          <p className="font-medium">{disciple.name}</p>
          {disciple.isMyPrimary || disciple.isPrimary ? (
            <Badge className="text-[10px]">Primary</Badge>
          ) : null}
        </div>
        <div className="flex flex-col items-start text-xs capitalize text-muted-foreground">
          {isAdmin ? <span>Leader: {disciple.leader?.name}</span> : null}
          <span>
            CG: {disciple.cell_status.replace("_", " ").toLowerCase()}
          </span>
          <span>
            Church:{" "}
            {disciple.church_status === "REGULAR"
              ? "Regular"
              : disciple.church_status}
          </span>
          <span>
            Process: {disciple.process_level.replace("_", " ").toLowerCase()}
          </span>
        </div>
      </Card>

      <Drawer open={menuOpen} onOpenChange={setMenuOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1 rounded-full"
          >
            <MoreVertical className="h-5 w-5" />
            <span className="sr-only">disciple menu for {disciple.name}</span>
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="pb-0">
            <DrawerTitle>{disciple.name}</DrawerTitle>
            <DrawerDescription>Pick an action</DrawerDescription>
          </DrawerHeader>
          <div className="space-y-1 px-2 py-4">
            <Link
              href={`/disciples/${disciple.id}`}
              className="flex w-full items-center gap-4 rounded-full px-1.5 py-1 text-sm focus:bg-neutral-900 focus-visible:bg-neutral-900 active:bg-neutral-900"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted shadow">
                <Eye className="h-5 w-5" />
              </span>
              <span>View Details</span>
            </Link>
            <Link
              href={`/disciples/edit/${disciple.id}`}
              className="flex w-full items-center gap-4 rounded-full px-1.5 py-1 text-sm focus:bg-neutral-900 focus-visible:bg-neutral-900 active:bg-neutral-900"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted shadow">
                <Edit className="h-5 w-5" />
              </span>
              <span>Edit Details</span>
            </Link>
            <Link
              href={`/disciples/${disciple.id}/lessons`}
              className="flex w-full items-center gap-4 rounded-full px-1.5 py-1 text-sm focus:bg-neutral-900 focus-visible:bg-neutral-900 active:bg-neutral-900"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted shadow">
                <Book className="h-5 w-5" />
              </span>
              <span>View Lessons Taken</span>
            </Link>
            <Link
              href={`/disciples/${disciple.id}/cell-groups`}
              className="flex w-full items-center gap-4 rounded-full px-1.5 py-1 text-sm focus:bg-neutral-900 focus-visible:bg-neutral-900 active:bg-neutral-900"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted shadow">
                <Users className="h-5 w-5" />
              </span>
              <span>View Attended Cell Groups</span>
            </Link>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default DiscipleMobileListItem
