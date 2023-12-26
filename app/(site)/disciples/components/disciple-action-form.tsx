"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { Disciple } from "@prisma/client"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"

function DiscipleActionForm({ disciple }: { disciple: Disciple }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isMyPrimary, setIsMyPrimary] = useState(() => disciple.isMyPrimary)
  const [isActive, setIsActive] = useState(() => disciple.isActive)

  const router = useRouter()

  const handleAccountActions = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const response = await fetch(`/api/disciples/${disciple.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        isActive,
        isMyPrimary,
      }),
    })

    if (!response?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "The disciple record was not updated. Please try again.",
        variant: "destructive",
      })
    }
    toast({
      title: "Success!",
      description: "Changes were saved successfully!",
      variant: "success",
    })

    setIsLoading(false)

    router.refresh()
  }

  return (
    <form
      onSubmit={handleAccountActions}
      className="space-y-4 rounded-lg bg-muted p-4 shadow-lg"
    >
      <h3 className="font-semibold">Account Actions</h3>
      <div className="flex items-center justify-between">
        <p className="text-sm">Network Primary</p>
        <Switch checked={isMyPrimary} onCheckedChange={setIsMyPrimary} />
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm">Still active?</p>
        <Switch checked={isActive} onCheckedChange={setIsActive} />
      </div>
      <Button disabled={isLoading}>{isLoading ? "Saving..." : "Save"}</Button>
    </form>
  )
}

export default DiscipleActionForm
