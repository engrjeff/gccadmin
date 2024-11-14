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

import { updateDisciple } from "./actions"

export function DiscipleChangeActiveStatusDialog({
  discipleName,
  discipleId,
  isActive,
  ...dialogProps
}: React.ComponentProps<typeof AlertDialog> & {
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
    <AlertDialog {...dialogProps}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Update Status</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to make{" "}
            <span className="font-semibold text-blue-500">{discipleName}</span>{" "}
            {isActive ? "inactive" : "active"}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={action.isPending}>
            Cancel
          </AlertDialogCancel>
          <SubmitButton
            type="button"
            loading={action.isPending}
            onClick={handleChangeStatus}
          >
            Confirm
          </SubmitButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
