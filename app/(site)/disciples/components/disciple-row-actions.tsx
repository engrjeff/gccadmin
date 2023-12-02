"use client"

import Link from "next/link"
import { Disciple } from "@prisma/client"
import { Book, Edit, Eye, MoreHorizontal, Trash, Users } from "lucide-react"

import { useSelectedDiscipleStore } from "@/lib/hooks"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

function DiscipleRowActions({ disciple }: { disciple: Disciple }) {
  const { setSelectedDisciple } = useSelectedDiscipleStore()

  return (
    <div className="flex items-center gap-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={`/disciples/${disciple.id}`}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md p-0 transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <span className="sr-only">View</span>
              <Eye className="h-4 w-4" />
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <span>View Disciple</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={`/disciples/${disciple.id}/edit`}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md p-0 transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <span className="sr-only">Edit</span>
              <Edit className="h-4 w-4" />
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <span>Edit Disciple</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link href={`/disciples/${disciple.id}/lessons`}>
              <Book className="mr-2 h-4 w-4" />
              <span>Lessons Taken</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/disciples/${disciple.id}/lessons`}>
              <Users className="mr-2 h-4 w-4" />
              <span>Attended Cell Groups</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setSelectedDisciple(disciple)}>
            <Trash className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default DiscipleRowActions
