"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { Disciple, User } from "@prisma/client"
import { useSession } from "next-auth/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"

interface DetailsFormProps {
  disciple: Disciple
  accountOptions: User[]
  leaderOptions: Disciple[]
}

function DetailsForm({
  disciple,
  accountOptions,
  leaderOptions,
}: DetailsFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const session = useSession()

  const isAdmin = session.data?.user?.role === "ADMIN"

  const handleAction = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setIsLoading(true)

    const form = new FormData(e.currentTarget)
    const values = Object.fromEntries(form.entries())

    const response = await fetch(`/api/disciples/${disciple.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...values,
        isActive: values.isActive === "on" ? true : false,
        isMyPrimary: values.isMyPrimary === "on" ? true : false,
      }),
    })

    setIsLoading(false)

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

    router.refresh()
  }
  return (
    <form
      onSubmit={handleAction}
      className={cn("space-y-4 rounded-lg border p-4", {
        "pointer-events-none opacity-80": isLoading,
      })}
    >
      <p className="text-sm font-semibold uppercase text-muted-foreground">
        Actions
      </p>

      {!disciple.userAccountId && isAdmin && (
        <div className="grid grid-cols-3 items-center">
          <p>Assign a User Account</p>
          <Select
            name="userAccountId"
            defaultValue={disciple.userAccountId ?? undefined}
            disabled={accountOptions.length === 0}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pick an Account" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Account</SelectLabel>
                {accountOptions.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}

      {!disciple.isPrimary && isAdmin && (
        <div className="grid grid-cols-3 items-center">
          <p>Assign a Leader</p>
          <Select name="leaderId" defaultValue={disciple.leaderId ?? undefined}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pick a Leader" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Leader</SelectLabel>
                {leaderOptions.map((leader) => (
                  <SelectItem key={leader.id} value={leader.id}>
                    {leader.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}

      {!isAdmin && (
        <div className="grid grid-cols-3 items-center">
          <p>Mark as My Primary</p>
          <div className="flex items-center space-x-2">
            <Switch
              id="isMyPrimary"
              name="isMyPrimary"
              defaultChecked={disciple.isMyPrimary}
            />
            <Label htmlFor="isMyPrimary">
              {disciple.isMyPrimary ? "Unmark" : "Mark"} as my Primary
            </Label>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 items-center">
        <p>Inactivity</p>
        <div className="flex items-center space-x-2">
          <Switch
            id="isActive"
            name="isActive"
            defaultChecked={disciple.isActive}
          />
          <Label htmlFor="isActive">
            Mark as {disciple.isActive ? "Inactive" : "Active"}
          </Label>
        </div>
      </div>
      <Button type="submit" size="sm">
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  )
}

export default DetailsForm
