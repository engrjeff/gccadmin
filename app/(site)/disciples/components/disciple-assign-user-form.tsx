"use client"

import { FormEvent, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { User } from "@prisma/client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import Autocomplete from "@/components/autocomplete"

interface DiscipleAssignUserFormProps {
  accountId: string | null
  userAccounts: User[]
}

function DiscipleAssignUserForm({
  accountId,
  userAccounts,
}: DiscipleAssignUserFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [userAccountId, setUserAccountId] = useState(() => accountId)

  const router = useRouter()
  const params = useParams<{ id: string }>()

  const handleConfirm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!userAccountId) return

    setIsLoading(true)
    const response = await fetch(`/api/disciples/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userAccountId,
      }),
    })

    if (!response?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Cannot assign user to disciple. Please try again.",
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
      onSubmit={handleConfirm}
      className="rounded-lg bg-muted p-4 shadow-lg"
    >
      <fieldset
        className="space-y-4"
        disabled={isLoading || userAccounts.length === 0}
      >
        <h3 className="font-semibold">Assign User</h3>
        <div className="max-w-xs">
          {accountId ? (
            <Input
              readOnly
              disabled
              name="userAccountId"
              defaultValue={accountId}
            />
          ) : (
            <Autocomplete
              searchText="Search user account"
              placeholderText="Select a user"
              value={userAccountId ?? undefined}
              onChange={setUserAccountId}
              options={userAccounts.map((i) => ({
                value: i.id,
                label: i.name!,
              }))}
            />
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Assign this disciple to a registered user account.
        </p>
        {!accountId && (
          <Button disabled={isLoading}>
            {isLoading ? "Saving..." : "Confirm"}
          </Button>
        )}
      </fieldset>
    </form>
  )
}

export default DiscipleAssignUserForm
