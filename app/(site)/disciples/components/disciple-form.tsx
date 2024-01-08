"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"
import { Controller, useForm } from "react-hook-form"

import { usePrimaryLeaders } from "@/hooks/use-primary-leaders"
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

import { cellStatuses, churchStatuses, processLevels } from "../constants"

const initialValues: Partial<DiscipleCreateInputs> = {
  name: "",
  address: "",
  birthdate: "1990-01-01",
  gender: "MALE",
  cell_status: "FIRST_TIMER",
  church_status: "NACS",
  member_type: "KIDS",
  process_level: "NONE",
}

interface DiscipleFormProps {
  modalMode?: boolean
  leaderId?: string
}

function DiscipleForm({ modalMode, leaderId }: DiscipleFormProps) {
  const session = useSession()

  const isAdmin = session.data?.user?.role === "ADMIN"
  const userId = session.data?.user?.discipleId

  const primaryLeaders = usePrimaryLeaders()
  const router = useRouter()
  const searchParams = useSearchParams()

  const leaderIdQueryParam = searchParams.get("leaderId")

  const form = useForm<DiscipleCreateInputs>({
    defaultValues: {
      ...initialValues,
      leaderId: leaderIdQueryParam ? leaderIdQueryParam : leaderId,
    },
    mode: "onChange",
    resolver: zodResolver(discipleCreateSchema),
  })

  const { isSubmitting, errors: formErrors } = form.formState

  const onSubmit = (shouldAddMore?: boolean) => async () => {
    const values = form.getValues()

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

    if (!shouldAddMore) router.replace("/disciples")

    router.refresh()
    form.reset()
  }

  const onError = (errors: typeof formErrors) => {
    console.error(errors)
  }

  return (
    <div className="rounded-lg shadow-lg md:border md:p-6">
      <form onSubmit={form.handleSubmit(onSubmit(), onError)}>
        <fieldset
          disabled={isSubmitting}
          className="space-y-3 disabled:pointer-events-none disabled:opacity-80"
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
              <Controller
                control={form.control}
                name="leaderId"
                render={({ field }) => (
                  <Autocomplete
                    searchText="Search leader"
                    placeholderText="Select a leader"
                    value={field.value}
                    onChange={field.onChange}
                    disabled={modalMode}
                    options={
                      primaryLeaders.data?.map((i) => ({
                        value: i.id,
                        label: i.name,
                      })) ?? []
                    }
                    error={!!formErrors.leaderId}
                  />
                )}
              />
              <FormErrorMessage
                id="leaderIdError"
                error={formErrors.leaderId?.message}
              />
            </div>
          ) : (
            <input
              hidden
              defaultValue={userId}
              {...form.register("leaderId")}
            />
          )}
          <div className="grid gap-4 pt-1 lg:grid-cols-4">
            <div className="flex w-full max-w-xs flex-col space-y-2">
              <Label htmlFor="cell_status">Cell Status</Label>
              <Controller
                control={form.control}
                name="cell_status"
                render={({ field }) => (
                  <Select
                    name="cell_status"
                    value={field.value === undefined ? "" : field.value}
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
            <div className="flex w-full max-w-xs flex-col space-y-2">
              <Label htmlFor="church_status">Church Status</Label>
              <Controller
                control={form.control}
                name="church_status"
                render={({ field }) => (
                  <Select
                    name="church_status"
                    value={field.value === undefined ? "" : field.value}
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
            <div className="flex w-full max-w-xs flex-col space-y-2">
              <Label htmlFor="member_type">Member Type</Label>
              <Controller
                control={form.control}
                name="member_type"
                render={({ field }) => (
                  <Select
                    name="member_type"
                    value={field.value === undefined ? "" : field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full capitalize">
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
              <Controller
                control={form.control}
                name="process_level"
                render={({ field }) => (
                  <Select
                    name="process_level"
                    value={field.value === undefined ? "" : field.value}
                    onValueChange={field.onChange}
                    disabled={form.watch("cell_status") === "FIRST_TIMER"}
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
          <div className="flex flex-col-reverse gap-4 pt-10 md:flex-row md:items-center">
            <Button variant="outline" type="reset" onClick={() => form.reset()}>
              Reset
            </Button>
            {modalMode ? null : (
              <Button
                variant="outline"
                type="button"
                className="hidden"
                onClick={form.handleSubmit(onSubmit(true), onError)}
              >
                Save and Add Another
              </Button>
            )}
            {modalMode ? (
              <Button
                type="button"
                onClick={form.handleSubmit(onSubmit(true), onError)}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            ) : (
              <Button type="submit">
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            )}
          </div>
        </fieldset>
      </form>
    </div>
  )
}

export default DiscipleForm
