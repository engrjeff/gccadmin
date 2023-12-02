"use client"

import { FormEventHandler, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Disciple } from "@prisma/client"
import { useSession } from "next-auth/react"
import { Controller, useForm } from "react-hook-form"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import FormErrorMessage from "@/components/ui/form-error-message"
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
import { toast } from "@/components/ui/use-toast"
import Autocomplete from "@/components/autocomplete"
import {
  DiscipleCreateInputs,
  discipleCreateSchema,
} from "@/app/api/disciples/schema"

import {
  cellStatuses,
  churchStatuses,
  memberTypes,
  processLevels,
} from "../constants"

const initialValues: DiscipleCreateInputs = {
  name: "",
  address: "",
  birthdate: "1990-01-01",
  gender: "MALE",
  cell_status: "FIRST_TIMER",
  church_status: "NACS",
  member_type: "MEN",
  process_level: "NONE",
}

interface DiscipleFormProps {
  leaderOptions: Disciple[]
}

function DiscipleForm({ leaderOptions }: DiscipleFormProps) {
  const session = useSession()

  const isAdmin = session.data?.user?.role === "ADMIN"

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const form = useForm<DiscipleCreateInputs>({
    defaultValues: initialValues,
    resolver: zodResolver(
      isAdmin
        ? discipleCreateSchema.required({ leaderId: true })
        : discipleCreateSchema
    ),
  })

  const formErrors = form.formState.errors

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

  async function onSubmit(values: DiscipleCreateInputs) {
    console.log(values)
  }

  async function onError(errors: typeof formErrors) {
    console.error(errors)
  }

  return (
    <div className="rounded-lg bg-muted p-6 shadow-lg">
      <form
        className={cn("space-y-3", {
          "pointer-events-none opacity-80": isLoading,
        })}
        onSubmit={form.handleSubmit(onSubmit, onError)}
      >
        <p className="text-sm text-foreground">Personal Information</p>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="Name"
            aria-invalid={!!formErrors.name}
            aria-describedby="nameError"
            {...form.register("name")}
          />
          <FormErrorMessage id="nameError" error={formErrors.name?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            placeholder="Address"
            aria-invalid={!!formErrors.address}
            aria-describedby="addressError"
            {...form.register("address")}
          />
          <FormErrorMessage
            id="addressError"
            error={formErrors.address?.message}
          />
        </div>
        <div className="flex w-60 flex-col gap-2 pt-1">
          <Label htmlFor="birthdate">Birthdate</Label>
          <Input
            type="date"
            id="birthdate"
            placeholder="Birthdate"
            max="2015-12-31"
            pattern="\d{4}-\d{2}-\d{2}"
            aria-invalid={!!formErrors.birthdate}
            aria-describedby="birthdateError"
            {...form.register("birthdate")}
          />
          <FormErrorMessage
            id="birthdateError"
            error={formErrors.birthdate?.message}
          />
        </div>
        <div className="space-y-2 pb-4">
          <Label htmlFor="gender">Gender</Label>
          <Controller
            control={form.control}
            name="gender"
            render={({ field }) => (
              <RadioGroup
                id="gender"
                value={field.value}
                ref={field.ref}
                onChange={field.onChange}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="MALE" id="MALE" />
                  <Label htmlFor="MALE">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="FEMALE" id="FEMALE" />
                  <Label htmlFor="FEMALE">Female</Label>
                </div>
              </RadioGroup>
            )}
          />
        </div>
        <Separator />
        <p className="pt-4 text-sm text-foreground">
          Church-related Information
        </p>
        {isAdmin ? (
          <div className="flex flex-col space-y-2">
            <Label htmlFor="leaderId">Leader</Label>
            <Controller
              control={form.control}
              name="leaderId"
              render={({ field }) => (
                <Autocomplete
                  searchText="Search leader"
                  placeholderText="Select a leader"
                  value={field.value}
                  onChange={field.onChange}
                  options={leaderOptions.map((i) => ({
                    value: i.id,
                    label: i.name,
                  }))}
                />
              )}
            />
            <FormErrorMessage
              id="leaderIdError"
              error={formErrors.leaderId?.message}
            />
          </div>
        ) : null}
        <div className="grid gap-4 pt-1 lg:grid-cols-4">
          <div className="flex w-full flex-col space-y-2">
            <Label htmlFor="cell_status">Cell Status</Label>
            <Controller
              control={form.control}
              name="cell_status"
              render={({ field }) => (
                <Select
                  name="cell_status"
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full capitalize">
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
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="flex w-full flex-col space-y-2">
            <Label htmlFor="church_status">Church Status</Label>
            <Controller
              control={form.control}
              name="church_status"
              render={({ field }) => (
                <Select
                  name="church_status"
                  value={field.value}
                  onValueChange={field.onChange}
                >
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
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>
        <div className="grid gap-4 pt-1 lg:grid-cols-4">
          <div className="flex w-full flex-col space-y-2">
            <Label htmlFor="member_type">Member Type</Label>
            <Controller
              control={form.control}
              name="member_type"
              render={({ field }) => (
                <Select
                  name="member_type"
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full capitalize">
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
              )}
            />
          </div>
          <div className="flex w-full flex-col space-y-2">
            <Label htmlFor="process_level">Process Level</Label>
            <Controller
              control={form.control}
              name="process_level"
              render={({ field }) => (
                <Select
                  name="process_level"
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full capitalize">
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
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>
        <div className="flex items-center gap-3 pt-10">
          <Button type="submit">{isLoading ? "Saving..." : "Save"}</Button>
          <Button variant="outline" type="button">
            Save and Add Another
          </Button>
          <Button variant="ghost" type="reset">
            Reset
          </Button>
        </div>
      </form>
    </div>
  )
}

export default DiscipleForm
