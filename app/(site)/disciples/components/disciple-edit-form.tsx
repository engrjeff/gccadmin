"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Disciple } from "@prisma/client"
import { format } from "date-fns"
import { useSession } from "next-auth/react"
import { Controller, useForm } from "react-hook-form"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import FormErrorMessage from "@/components/ui/form-error-message"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect } from "@/components/ui/native-select"
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
  DiscipleUpdateInputs,
  discipleUpdateSchema,
} from "@/app/api/disciples/schema"

import {
  cellStatuses,
  churchStatuses,
  processLevels,
  processLevelStatuses,
} from "../constants"

interface DiscipleFormProps {
  leaderOptions: Disciple[]
  disciple: Disciple
}

function DiscipleEditForm({ leaderOptions, disciple }: DiscipleFormProps) {
  const session = useSession()

  const isAdmin = session.data?.user?.role === "ADMIN"
  const userId = session.data?.user?.discipleId

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<DiscipleUpdateInputs>({
    mode: "onChange",
    defaultValues: {
      name: disciple.name,
      address: disciple.address,
      birthdate: format(new Date(disciple.birthdate), "yyyy-MM-dd"),
      gender: disciple.gender,
      leaderId: disciple.leaderId!,
      cell_status: disciple.cell_status,
      church_status: disciple.church_status,
      member_type: disciple.member_type,
      process_level: disciple.process_level,
      process_level_status: disciple.process_level_status,
    },
    resolver: zodResolver(discipleUpdateSchema),
  })

  const formErrors = form.formState.errors

  const onSubmit = async () => {
    const values = form.getValues()

    setIsLoading(true)

    const response = await fetch(`/api/disciples/${disciple.id}`, {
      method: "PUT",
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
        description: "The disciple record was not updated. Please try again.",
        variant: "destructive",
      })
    }
    toast({
      title: "Success!",
      description: "The disciple was updated successfully!",
      variant: "success",
    })

    router.refresh()
  }

  const onError = (errors: typeof formErrors) => {
    console.error(errors)
  }

  return (
    <div className="rounded-lg shadow-lg md:border md:p-6">
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
                onValueChange={(value) => {
                  field.onChange(value)

                  if (
                    form.watch("member_type") === "MEN" &&
                    value === "FEMALE"
                  ) {
                    form.setValue("member_type", "WOMEN")
                  }

                  if (
                    form.watch("member_type") === "WOMEN" &&
                    value === "MALE"
                  ) {
                    form.setValue("member_type", "MEN")
                  }
                }}
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
          <div className="flex flex-col space-y-2 md:max-w-xs">
            <Label htmlFor="leaderId">Leader</Label>
            <NativeSelect
              key={form.watch("leaderId")}
              className="normal-case lg:hidden"
              id="leaderId"
              {...form.register("leaderId")}
              aria-invalid={!!formErrors.leaderId}
            >
              <option value="">Select a leader</option>
              {leaderOptions?.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </NativeSelect>
            <div className="hidden lg:block">
              <Controller
                control={form.control}
                name="leaderId"
                render={({ field }) => (
                  <Autocomplete
                    searchText="Search leader"
                    placeholderText="Select a leader"
                    value={field.value}
                    onChange={field.onChange}
                    options={
                      leaderOptions?.map((i) => ({
                        value: i.id,
                        label: i.name,
                      })) ?? []
                    }
                    error={!!formErrors.leaderId}
                  />
                )}
              />
            </div>
            <FormErrorMessage
              id="leaderIdError"
              error={formErrors.leaderId?.message}
            />
          </div>
        ) : (
          <input hidden defaultValue={userId} {...form.register("leaderId")} />
        )}
        <div className="grid gap-4 pt-1 lg:grid-cols-4">
          <div className="flex w-full max-w-xs flex-col space-y-2">
            <Label htmlFor="cell_status">Cell Status</Label>
            <NativeSelect
              key={form.watch("cell_status")}
              className="lg:hidden"
              id="cell_status"
              {...form.register("cell_status")}
            >
              {cellStatuses.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </NativeSelect>
            <Controller
              control={form.control}
              name="cell_status"
              render={({ field }) => (
                <Select
                  name="cell_status"
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="hidden w-full capitalize lg:flex">
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
          <div className="flex w-full max-w-xs flex-col space-y-2">
            <Label htmlFor="church_status">Church Status</Label>
            <NativeSelect
              key={form.watch("church_status")}
              className="lg:hidden"
              id="church_status"
              {...form.register("church_status")}
            >
              {churchStatuses.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </NativeSelect>
            <Controller
              control={form.control}
              name="church_status"
              render={({ field }) => (
                <Select
                  name="church_status"
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="hidden w-full lg:flex">
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
          <div className="flex w-full max-w-xs flex-col space-y-2">
            <Label htmlFor="member_type">Member Type</Label>
            <NativeSelect
              key={form.watch("member_type")}
              className="lg:hidden"
              id="member_type"
              {...form.register("member_type")}
            >
              <option value="KIDS">Kids</option>
              <option value="YOUTH">Youth</option>
              <option value="YOUNGPRO">Young Pro</option>
              <option disabled={form.watch("gender") === "FEMALE"} value="MEN">
                Men
              </option>
              <option disabled={form.watch("gender") === "MALE"} value="WOMEN">
                Women
              </option>
            </NativeSelect>
            <Controller
              control={form.control}
              name="member_type"
              render={({ field }) => (
                <Select
                  name="member_type"
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="hidden w-full capitalize lg:flex">
                    <SelectValue placeholder="Member Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Member Type</SelectLabel>
                      <SelectItem value="KIDS">Kids</SelectItem>
                      <SelectItem value="YOUTH">Youth</SelectItem>
                      <SelectItem value="YOUNGPRO">Young Pro</SelectItem>
                      <SelectItem
                        disabled={form.watch("gender") === "FEMALE"}
                        value="MEN"
                      >
                        Men
                      </SelectItem>
                      <SelectItem
                        disabled={form.watch("gender") === "MALE"}
                        value="WOMEN"
                      >
                        Women
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="flex w-full max-w-xs flex-col space-y-2">
            <Label htmlFor="process_level">Process Level</Label>
            <NativeSelect
              key={form.watch("process_level")}
              className="lg:hidden"
              id="process_level"
              {...form.register("process_level")}
              disabled={form.watch("cell_status") === "FIRST_TIMER"}
            >
              {processLevels.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </NativeSelect>
            <Controller
              control={form.control}
              name="process_level"
              render={({ field }) => (
                <Select
                  name="process_level"
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={form.watch("cell_status") === "FIRST_TIMER"}
                >
                  <SelectTrigger className="hidden w-full capitalize lg:flex">
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

          <div className="flex w-full max-w-xs flex-col space-y-2">
            <Label htmlFor="process_level_status">Process Status</Label>
            <NativeSelect
              key={form.watch("process_level_status")}
              className="lg:hidden"
              id="process_level_status"
              {...form.register("process_level_status")}
              disabled={form.watch("process_level") === "NONE"}
            >
              {processLevelStatuses.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </NativeSelect>
            <Controller
              control={form.control}
              name="process_level_status"
              render={({ field }) => (
                <Select
                  name="process_level_status"
                  value={field.value === undefined ? "" : field.value}
                  onValueChange={field.onChange}
                  disabled={form.watch("process_level") === "NONE"}
                >
                  <SelectTrigger className="hidden w-full capitalize lg:flex">
                    <SelectValue placeholder="Process Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Process Status</SelectLabel>
                      {processLevelStatuses.map((item) => (
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
        <div className="flex flex-col-reverse gap-4 pt-10 md:flex-row md:items-center">
          <Link
            href="/disciples"
            className={buttonVariants({ variant: "outline" })}
          >
            Cancel
          </Link>
          <Button type="submit">
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default DiscipleEditForm
