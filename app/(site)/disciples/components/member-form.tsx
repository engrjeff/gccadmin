"use client"

import { FormEventHandler, useState } from "react"
import { useRouter } from "next/navigation"
import { Disciple } from "@prisma/client"
import { Plus } from "lucide-react"
import { useSession } from "next-auth/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { toast } from "@/components/ui/use-toast"

import {
  cellStatuses,
  churchStatuses,
  memberTypes,
  processLevels,
} from "../constants"

interface MemberFormProps {
  leaderOptions: Disciple[]
}

export default function MemberForm({ leaderOptions }: MemberFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const session = useSession()

  const isAdmin = session.data?.user?.role === "ADMIN"

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    setIsLoading(true)

    const form = new FormData(e.currentTarget)
    const values = Object.fromEntries(form.entries())

    const response = await fetch("/api/disciples", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...values,
        birthdate: new Date(values.birthdate as string),
      }),
    })

    setIsLoading(false)

    if (!response?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "The disciple record was not created. Please try again.",
        variant: "destructive",
      })
    }
    toast({
      title: "Success!",
      description: "The disciple was created successfully!",
      variant: "success",
    })
    // This forces a cache invalidation.
    router.refresh()

    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-5" /> Add Member
        </Button>
      </SheetTrigger>
      <SheetContent position="right" size="sm" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add Member</SheetTitle>
          <SheetDescription>
            Create a new member here. Click save when you are done.
          </SheetDescription>
        </SheetHeader>
        <form
          key={String(open)}
          className={cn("space-y-3 py-4", {
            "pointer-events-none opacity-80": isLoading,
          })}
          onSubmit={handleSubmit}
        >
          <p className="text-sm text-foreground">Personal Information</p>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" placeholder="Name" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" name="address" placeholder="Address" />
          </div>
          <div className="flex flex-col gap-2 pt-1">
            <Label htmlFor="birthdate">Birthdate</Label>
            <Input
              type="date"
              id="birthdate"
              name="birthdate"
              placeholder="Birthdate"
            />
          </div>
          <div className="space-y-2 pb-4">
            <Label htmlFor="gender">Gender</Label>
            <RadioGroup defaultValue="MALE" name="gender" id="gender">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="MALE" id="MALE" />
                <Label htmlFor="MALE">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="FEMALE" id="FEMALE" />
                <Label htmlFor="FEMALE">Female</Label>
              </div>
            </RadioGroup>
          </div>
          <Separator />
          <p className="pt-4 text-sm text-foreground">
            Church-related Information
          </p>
          {isAdmin ? (
            <div className="flex flex-col space-y-2">
              <Label htmlFor="leaderId">Leader</Label>
              <Select name="leaderId">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pick a leader" />
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
          ) : null}
          <div className="grid gap-4 pt-1 lg:grid-cols-2">
            <div className="flex w-full flex-col space-y-2">
              <Label htmlFor="cell_status">Cell Status</Label>
              <Select name="cell_status">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Cell Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Cell Status</SelectLabel>
                    {cellStatuses.map((item) => (
                      <SelectItem
                        key={item.value}
                        value={item.value}
                        className="capitalize"
                      >
                        {item.label.split("_").join(" ")}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-full flex-col space-y-2">
              <Label htmlFor="church_status">Church Status</Label>
              <Select name="church_status">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Church Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Church Status</SelectLabel>
                    {churchStatuses.map((item) => (
                      <SelectItem
                        key={item.value}
                        value={item.value}
                        className="capitalize"
                      >
                        {item.label.split("_").join(" ")}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 pt-1 lg:grid-cols-2">
            <div className="flex w-full flex-col space-y-2">
              <Label htmlFor="member_type">Member Type</Label>
              <Select name="member_type">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Member Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Member Type</SelectLabel>
                    {memberTypes.map((item) => (
                      <SelectItem
                        key={item.value}
                        value={item.value}
                        className="capitalize"
                      >
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-full flex-col space-y-2">
              <Label htmlFor="process_level">Process Level</Label>
              <Select name="process_level">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Process Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Process Level</SelectLabel>
                    {processLevels.map((item) => (
                      <SelectItem
                        key={item.value}
                        value={item.value}
                        className="capitalize"
                      >
                        {item.label.split("_").join(" ")}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <SheetFooter className="flex items-center gap-2 pt-10">
            <Button variant="outline" type="reset">
              Reset
            </Button>
            <Button type="submit">{isLoading ? "Saving..." : "Save"}</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
