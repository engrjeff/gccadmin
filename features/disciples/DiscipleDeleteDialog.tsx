"use client"

import React from "react"
import { useAction } from "next-safe-action/hooks"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { SubmitButton } from "@/components/ui/submit-button"
import { toast } from "@/components/ui/use-toast"

import { deleteDisciple } from "./actions"

export function DiscipleDeleteDialog({
  discipleName,
  discipleId,
  ...dialogProps
}: React.ComponentProps<typeof AlertDialog> & {
  discipleName: string
  discipleId: string
}) {
  const action = useAction(deleteDisciple, {
    onError({ error }) {
      toast({
        title: "Something went wrong.",
        description: "The disciple record was not deleted. Please try again.",
        variant: "destructive",
      })
    },
    onSuccess() {
      toast({
        title: "Success!",
        description: "The disciple was deleted successfully!",
        variant: "success",
      })
    },
  })

  const handleDelete = async () => {
    const result = await action.executeAsync({ id: discipleId })
    if (result?.data?.status === "ok") {
      if (dialogProps.onOpenChange) {
        dialogProps.onOpenChange(false)
      }
    }
  }
  return (
    <AlertDialog {...dialogProps}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Do you really want to delete{" "}
            <span className="font-semibold">{discipleName}</span>?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            record.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={action.isPending}>
            Cancel
          </AlertDialogCancel>
          <SubmitButton
            type="button"
            variant="destructive"
            loading={action.isPending}
            onClick={handleDelete}
          >
            Confirm
          </SubmitButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
