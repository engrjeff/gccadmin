"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Disciple } from "@prisma/client"
import { Book, Edit, Eye, MoreHorizontal, Trash, Users } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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
import { toast } from "@/components/ui/use-toast"

import { useCurrentDisciple } from "./current-disciple-provider"

function DiscipleRowActions({ disciple }: { disciple: Disciple }) {
  const router = useRouter()
  const { setSelectedDisciple, setEditFormOpen } = useCurrentDisciple()

  const [deleteDialogShown, setDeleteDialogShown] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEditClick = () => {
    setSelectedDisciple(disciple)
    setEditFormOpen(true)
  }

  const handleDelete = async () => {
    setIsDeleting(true)

    const response = await fetch(`/api/disciples/${disciple.id}`, {
      method: "DELETE",
    })

    if (!response?.ok) {
      setIsDeleting(false)
      return toast({
        title: "Something went wrong.",
        description: "The disciple record was not deleted. Please try again.",
        variant: "destructive",
      })
    }
    toast({
      title: "Success!",
      description: "The disciple was deleted successfully!",
      variant: "success",
    })

    setIsDeleting(false)
    // This forces a cache invalidation.
    router.refresh()

    setDeleteDialogShown(false)
  }

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
            <Button
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={handleEditClick}
            >
              <span className="sr-only">Edit</span>
              <Edit className="h-4 w-4" />
            </Button>
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
          <DropdownMenuItem onClick={() => setDeleteDialogShown(true)}>
            <Trash className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={deleteDialogShown} onOpenChange={setDeleteDialogShown}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Do you really want to delete{" "}
              <span className="font-semibold">{disciple.name}</span>?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={isDeleting}
              onClick={handleDelete}
            >
              {isDeleting ? "Deleting..." : "Confirm"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default DiscipleRowActions
