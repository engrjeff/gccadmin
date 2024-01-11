"use client"

import { useState } from "react"
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
import {
  BottomsheetLink,
  BottomsheetLinkIcon,
} from "@/components/bottomsheet-link"

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
        <div className="mb-2 space-y-0.5">
          <p className="text-sm font-medium">{disciple.name}</p>
          {disciple.isMyPrimary || disciple.isPrimary ? (
            <Badge className="text-[10px]">Primary</Badge>
          ) : null}
        </div>
        <div className="flex flex-col items-start text-xs capitalize text-muted-foreground">
          <div className="flex gap-x-1">
            {isAdmin ? (
              <span>Leader: {disciple.leader?.name} &#x2022; </span>
            ) : null}
            <span>
              CG: {disciple.cell_status.replace("_", " ").toLowerCase()}
            </span>
          </div>
          <div className="flex gap-x-1">
            <span>
              Church:{" "}
              {disciple.church_status === "REGULAR"
                ? "Regular"
                : disciple.church_status}{" "}
              &#x2022;
            </span>
            <span>
              Process: {disciple.process_level.replace("_", " ").toLowerCase()}
            </span>
          </div>
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
          <div className="space-y-1 px-2 py-6">
            <BottomsheetLink href={`/disciples/${disciple.id}`}>
              <BottomsheetLinkIcon>
                <Eye className="h-5 w-5" />
              </BottomsheetLinkIcon>
              <span>View Details</span>
            </BottomsheetLink>
            <BottomsheetLink href={`/disciples/edit/${disciple.id}`}>
              <BottomsheetLinkIcon>
                <Edit className="h-5 w-5" />
              </BottomsheetLinkIcon>
              <span>Edit Details</span>
            </BottomsheetLink>
            <BottomsheetLink href={`/disciples/${disciple.id}/lessons`}>
              <BottomsheetLinkIcon>
                <Book className="h-5 w-5" />
              </BottomsheetLinkIcon>
              <span>View Lessons Taken</span>
            </BottomsheetLink>
            <BottomsheetLink href={`/disciples/${disciple.id}/cell-groups`}>
              <BottomsheetLinkIcon>
                <Users className="h-5 w-5" />
              </BottomsheetLinkIcon>
              <span>View Attended Cell Groups</span>
            </BottomsheetLink>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default DiscipleMobileListItem
