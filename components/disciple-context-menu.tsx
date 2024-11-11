"use client"

import Link from "next/link"
import { Disciple } from "@prisma/client"
import { Verified } from "lucide-react"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

interface DiscipleContextMenuProps {
  disciple: Disciple
}

function DiscipleContextMenu({ disciple }: DiscipleContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Link
          href={`/disciples/${disciple.id}`}
          className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap text-sm hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {disciple.isPrimary ? (
            <Verified className="h-4 w-4 text-sky-500" />
          ) : null}
          {disciple.name}{" "}
        </Link>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel className="flex">{disciple.name}</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem asChild>
          <Link href={`/disciples/${disciple.id}`}>View Info</Link>
        </ContextMenuItem>
        {disciple.isPrimary ? (
          <ContextMenuItem asChild>
            <Link href={`/disciples/${disciple.id}/disciple-list`}>
              Disciples
            </Link>
          </ContextMenuItem>
        ) : null}
        <ContextMenuItem asChild>
          <Link href={`/disciples/${disciple.id}/lessons`}>Lessons Taken</Link>
        </ContextMenuItem>
        <ContextMenuItem asChild>
          <Link href={`/disciples/${disciple.id}/cell-groups`}>
            Attended Cell Groups
          </Link>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

export default DiscipleContextMenu
