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

import { updateDisciple } from "./actions"

export function DiscipleChangeActiveStatusDialog({
  discipleName,
  discipleId,
  isActive,
  ...dialogProps
}: React.ComponentProps<typeof Dialog> & {
  discipleName: string
  discipleId: string
  isActive: boolean
}) {
  const action = useAction(updateDisciple, {
    onError({ error }) {
      toast({
        title: "Something went wrong.",
        description: "The disciple status was not updated. Please try again.",
        variant: "destructive",
      })
    },
    onSuccess() {
      toast({
        title: "Success!",
        description: "The disciple's status was updated successfully!",
        variant: "success",
      })
    },
  })

  const handleChangeStatus = async () => {
    const result = await action.executeAsync({
      id: discipleId,
      isActive: !isActive,
    })
    if (result?.data?.disciple?.id) {
      if (dialogProps.onOpenChange) {
        dialogProps.onOpenChange(false)
      }
    }
  }
  return (
    <Dialog {...dialogProps}>
      <DialogContent className="rounded-lg">
        <DialogHeader className="text-left">
          <DialogTitle>Update Status</DialogTitle>
          <DialogDescription>
            Are you sure you want to make{" "}
            <span className="font-semibold text-blue-500">{discipleName}</span>{" "}
            {isActive ? "inactive" : "active"}?
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
            loading={action.isPending}
            onClick={handleChangeStatus}
          >
            Confirm
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
