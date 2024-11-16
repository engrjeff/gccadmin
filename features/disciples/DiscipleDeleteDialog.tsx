"use client"

import React from "react"
import { useAction } from "next-safe-action/hooks"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { SubmitButton } from "@/components/ui/submit-button"
import { toast } from "@/components/ui/use-toast"

import { deleteDisciple } from "./actions"

export function DiscipleDeleteDialog({
  discipleName,
  discipleId,
  ...dialogProps
}: React.ComponentProps<typeof Dialog> & {
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
    <Dialog {...dialogProps}>
      <DialogContent className="rounded-lg">
        <DialogHeader className="text-left">
          <DialogTitle>Delete</DialogTitle>
          <DialogDescription>
            Do you really want to delete{" "}
            <span className="font-semibold text-red-500">{discipleName}</span>?
            This action cannot be undone. This will permanently delete this
            record.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-row justify-end space-x-2">
          <DialogClose disabled={action.isPending} asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <SubmitButton
            type="button"
            variant="destructive"
            loading={action.isPending}
            onClick={handleDelete}
          >
            Confirm
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
