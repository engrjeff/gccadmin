"use client"

import { FormEvent, useState } from "react"
import { Disciple } from "@prisma/client"
import { useAction } from "next-safe-action/hooks"

import { SubmitButton } from "@/components/ui/submit-button"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"

import { updateDisciple } from "./actions"

export function DiscipleAccountActions({
  disciple,
  onAfterSave,
}: {
  disciple: Disciple
  onAfterSave: () => void
}) {
  const [isMyPrimary, setIsMyPrimary] = useState(() => disciple.isMyPrimary)
  const [isActive, setIsActive] = useState(() => disciple.isActive)

  const updateAction = useAction(updateDisciple, {
    onError({ error }) {
      toast({
        title: "Error",
        description: error.serverError,
        variant: "destructive",
      })
    },
    onSuccess() {
      toast({
        title: "Success!",
        description: "The disciple was updated successfully!",
        variant: "success",
      })
    },
  })

  const handleAccountActions = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      const result = await updateAction.executeAsync({
        id: disciple.id,
        isActive,
        isMyPrimary,
      })
      if (result?.data?.disciple?.id) {
        onAfterSave()
      }
    } catch (error) {}
  }

  return (
    <form onSubmit={handleAccountActions}>
      <fieldset
        disabled={updateAction.isPending}
        className="space-y-4 border-t p-4 shadow-lg"
      >
        <h3 className="font-semibold">Account Actions</h3>
        <div className="flex items-center justify-between">
          <p className="text-sm">Network Primary</p>
          <Switch
            disabled={!isActive}
            checked={isMyPrimary}
            onCheckedChange={setIsMyPrimary}
          />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm">Still active?</p>
          <Switch checked={isActive} onCheckedChange={setIsActive} />
        </div>
        <SubmitButton loading={updateAction.isPending}>Save</SubmitButton>
      </fieldset>
    </form>
  )
}
