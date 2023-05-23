import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Disciple } from "@prisma/client"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

import { useCurrentDisciple } from "./current-disciple-provider"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  disciple: Disciple
}

function DiscipleDeleteDialog({ open, onOpenChange, disciple }: Props) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  if (!disciple) return null

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

    router.push("/disciples")

    onOpenChange(false)
  }
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
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
  )
}

export default DiscipleDeleteDialog
