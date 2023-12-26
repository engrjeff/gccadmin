"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { useSelectedDiscipleStore } from "@/lib/hooks"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

function DiscipleDeleteDialog() {
  const [isDeleting, setIsDeleting] = useState(false)
  const { selectedDisciple, setSelectedDisciple } = useSelectedDiscipleStore()
  const router = useRouter()

  if (!selectedDisciple) return null

  const handleDelete = async () => {
    setIsDeleting(true)

    const response = await fetch(`/api/disciples/${selectedDisciple.id}`, {
      method: "DELETE",
    })

    if (!response?.ok) {
      setIsDeleting(false)
      setSelectedDisciple(null)
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

    setSelectedDisciple(null)
    // This forces a cache invalidation.
    router.refresh()

    router.push("/disciples")
  }
  return (
    <AlertDialog
      open={!!selectedDisciple}
      onOpenChange={(state) => state === false && setSelectedDisciple(null)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Do you really want to delete{" "}
            <span className="font-semibold">{selectedDisciple.name}</span>?
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
