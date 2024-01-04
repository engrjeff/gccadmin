"use client"

import { ComponentPropsWithRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronDown, ListPlus, Plus, XIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import {
  Controller,
  SubmitErrorHandler,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form"

import { cellStatuses, churchStatuses, processLevels } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { usePrimaryLeaders } from "@/hooks/use-primary-leaders"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import FormErrorMessage from "@/components/ui/form-error-message"
import { Input } from "@/components/ui/input"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import {
  BulkDiscipleCreateInputs,
  bulkDiscipleCreateSchema,
} from "@/app/api/disciples/schema"

function DiscipleBulkAddForm() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" className="rounded-l-none px-3">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => setOpen(true)}
            >
              <ListPlus className="mr-3 h-4 w-4" /> Bulk Add
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="sm:max-w-screen-xl"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Bulk Add Disciples</DialogTitle>
            <DialogDescription>
              Fill in every cell with proper values.
            </DialogDescription>
          </DialogHeader>
          <div>
            <BulkForm onDone={() => setOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default DiscipleBulkAddForm

interface BulkFormProps {
  onDone: () => void
}

const initialRowValue: BulkDiscipleCreateInputs["disciples"][number] = {
  name: "",
  address: "",
  birthdate: "1990-01-01",
  gender: "MALE",
  cell_status: "FIRST_TIMER",
  church_status: "NACS",
  member_type: "KIDS",
  process_level: "NONE",
}

function BulkForm({ onDone }: BulkFormProps) {
  const session = useSession()
  const primaryLeaders = usePrimaryLeaders()
  const router = useRouter()
  const params = useParams<{ id: string }>()

  const user = session.data?.user

  const form = useForm<BulkDiscipleCreateInputs>({
    resolver: zodResolver(bulkDiscipleCreateSchema),
    defaultValues: {
      leaderId: user?.role === "ADMIN" ? params.id : user?.discipleId,
      disciples: [initialRowValue, initialRowValue],
    },
  })

  const disciplesFields = useFieldArray({
    control: form.control,
    name: "disciples",
  })

  const [isLoading, setIsLoading] = useState(false)

  const { errors } = form.formState

  const onError: SubmitErrorHandler<BulkDiscipleCreateInputs> = (
    formErrors
  ) => {
    console.error("Bulk Disciples Create: ", formErrors)

    toast({
      title: "Fill in the required fields.",
      description: "Make sure that all fields are properly filled in.",
      variant: "destructive",
    })
  }

  const onSubmit: SubmitHandler<BulkDiscipleCreateInputs> = async (values) => {
    try {
      setIsLoading(true)

      const response = await fetch("/api/disciples/bulk", {
        method: "POST",
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        console.error(await response.json())
      }

      const result = await response.json()

      toast({
        title: "Success!",
        description: `${result.count} disciples were created successfully!`,
        variant: "success",
      })

      form.reset()

      router.refresh()

      onDone()
    } catch (error: any) {
      console.error(error)

      if (error.message) {
        toast({
          title: "Error!",
          description: error.message,
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn({ "pointer-events-none opacity-80": isLoading })}>
      <div className="mb-4 flex items-center gap-3">
        <div className={cn({ hidden: user?.role !== "ADMIN" })}>
          <Label htmlFor="leaderId">Leader</Label>
          <Controller
            control={form.control}
            name="leaderId"
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={Boolean(params.id)}
              >
                <SelectTrigger
                  aria-invalid={!!errors.leaderId}
                  aria-describedby="leaderIdError"
                  className="w-48"
                >
                  <SelectValue placeholder="Select a leader" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Leader</SelectLabel>
                    {primaryLeaders.data?.map((leader) => (
                      <SelectItem key={`leader-${leader.id}`} value={leader.id}>
                        {leader.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          <FormErrorMessage
            id="leaderIdError"
            error={errors.leaderId?.message}
          />
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="ml-auto"
          onClick={() => disciplesFields.append(initialRowValue)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Row
        </Button>
      </div>
      <Table className="rounded-md border">
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead className="pl-2">Name</TableHead>
            <TableHead className="pl-2">Birthdate</TableHead>
            <TableHead className="pl-2">Address</TableHead>
            <TableHead className="pl-2">Gender</TableHead>
            <TableHead className="pl-2">Member Type</TableHead>
            <TableHead className="pl-2">Cell Status</TableHead>
            <TableHead className="pl-2">Church Status</TableHead>
            <TableHead className="pl-2">Process Level</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {disciplesFields.fields.map((disciple, index) => (
            <TableRow key={disciple.id} className="group">
              <TableCell className="bg-muted2 p-0">
                <span className="flex h-full w-full items-center justify-center border-r group-hover:hidden">
                  {index + 1}
                </span>
                <Button
                  size="icon"
                  variant="destructive"
                  className="hidden h-full w-full rounded-none group-hover:flex"
                  onClick={() => disciplesFields.remove(index)}
                >
                  <XIcon className="h-4 w-4" />
                  <span className="sr-only">delete row</span>
                </Button>
              </TableCell>
              <TableCell className="border-r p-0">
                <Controller
                  control={form.control}
                  name={`disciples.${index}.name`}
                  render={({ field: { ref, ...fieldProps } }) => (
                    <CellInput
                      placeholder="Name"
                      autoFocus
                      autoComplete="off"
                      aria-invalid={
                        errors.disciples && !!errors.disciples[index]?.name
                      }
                      aria-describedby="nameError"
                      {...fieldProps}
                    />
                  )}
                />
                <FormErrorMessage
                  id="nameError"
                  className="sr-only"
                  error={
                    errors.disciples
                      ? errors.disciples[index]?.name?.message
                      : undefined
                  }
                />
              </TableCell>
              <TableCell className="border-r p-0">
                <Controller
                  control={form.control}
                  name={`disciples.${index}.birthdate`}
                  render={({ field: { ref, ...fieldProps } }) => (
                    <CellInput
                      type="date"
                      placeholder="Birthdate"
                      max="2015-12-31"
                      pattern="\d{4}-\d{2}-\d{2}"
                      aria-invalid={
                        errors.disciples &&
                        !!errors.disciples![index]?.birthdate
                      }
                      aria-describedby="birthdateError"
                      {...fieldProps}
                    />
                  )}
                />
                <FormErrorMessage
                  id="birthdateError"
                  className="sr-only"
                  error={
                    errors.disciples
                      ? errors.disciples![index]?.birthdate?.message
                      : undefined
                  }
                />
              </TableCell>
              <TableCell className="border-r p-0">
                <Controller
                  control={form.control}
                  name={`disciples.${index}.address`}
                  render={({ field: { ref, ...fieldProps } }) => (
                    <CellInput
                      placeholder="Address"
                      autoComplete="off"
                      aria-invalid={
                        errors.disciples && !!errors.disciples![index]?.address
                      }
                      aria-describedby="addressError"
                      {...fieldProps}
                    />
                  )}
                />
                <FormErrorMessage
                  id="addressError"
                  className="sr-only"
                  error={
                    errors.disciples
                      ? errors.disciples![index]?.address?.message
                      : undefined
                  }
                />
              </TableCell>
              <TableCell className="w-[100px] border-r p-0">
                <Controller
                  control={form.control}
                  name={`disciples.${index}.gender`}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value)

                        const memberTypeFieldKey =
                          `disciples.${index}.member_type` as const

                        const memberTypeRowValue =
                          form.watch(memberTypeFieldKey)

                        if (
                          memberTypeRowValue === "MEN" &&
                          value === "FEMALE"
                        ) {
                          form.setValue(memberTypeFieldKey, "WOMEN")
                        }

                        if (
                          memberTypeRowValue === "WOMEN" &&
                          value === "MALE"
                        ) {
                          form.setValue(memberTypeFieldKey, "MEN")
                        }
                      }}
                    >
                      <SelectTrigger className="h-full w-full gap-3 rounded-none border-transparent focus:border-primary focus:ring-0 focus:ring-offset-0">
                        <SelectValue placeholder="Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Gender</SelectLabel>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </TableCell>
              <TableCell className="border-r p-0">
                <Controller
                  control={form.control}
                  name={`disciples.${index}.member_type`}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-full w-full gap-3 rounded-none border-transparent capitalize focus:border-primary focus:ring-0 focus:ring-offset-0">
                        <SelectValue placeholder="Member Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Member Type</SelectLabel>
                          <SelectItem value="KIDS">Kids</SelectItem>
                          <SelectItem value="YOUTH">Youth</SelectItem>
                          <SelectItem value="YOUNGPRO">Young Pro</SelectItem>
                          <SelectItem
                            disabled={
                              form.watch(`disciples.${index}.gender`) ===
                              "FEMALE"
                            }
                            value="MEN"
                          >
                            Men
                          </SelectItem>
                          <SelectItem
                            disabled={
                              form.watch(`disciples.${index}.gender`) === "MALE"
                            }
                            value="WOMEN"
                          >
                            Women
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </TableCell>
              <TableCell className="border-r p-0">
                <Controller
                  control={form.control}
                  name={`disciples.${index}.cell_status`}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-full w-full gap-3 rounded-none border-transparent capitalize focus:border-primary focus:ring-0 focus:ring-offset-0">
                        <SelectValue placeholder="Cell Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Cell Status</SelectLabel>
                          {cellStatuses.map((option) => (
                            <SelectItem
                              key={`cell-status-${option.value}`}
                              value={option.value}
                              className="capitalize"
                            >
                              {option.label.replace(/_/, " ").toLowerCase()}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </TableCell>
              <TableCell className="border-r p-0">
                <Controller
                  control={form.control}
                  name={`disciples.${index}.church_status`}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-full w-full gap-3 rounded-none border-transparent capitalize focus:border-primary focus:ring-0 focus:ring-offset-0">
                        <SelectValue placeholder="Church Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Church Status</SelectLabel>
                          {churchStatuses.map((option) => (
                            <SelectItem
                              key={`church-status-${option.value}`}
                              value={option.value}
                              className="capitalize"
                            >
                              {option.value !== "REGULAR"
                                ? option.label
                                : option.label.replace(/_/, " ").toLowerCase()}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </TableCell>
              <TableCell className="border-r p-0">
                <Controller
                  control={form.control}
                  name={`disciples.${index}.process_level`}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={
                        form.watch(`disciples.${index}.cell_status`) ===
                        "FIRST_TIMER"
                      }
                    >
                      <SelectTrigger className="h-full w-full gap-3 rounded-none border-transparent capitalize focus:border-primary focus:ring-0 focus:ring-offset-0">
                        <SelectValue placeholder="Process" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Process Level</SelectLabel>
                          {processLevels.map((option) => (
                            <SelectItem
                              key={`process-level-${option.value}`}
                              value={option.value}
                              className="capitalize"
                            >
                              {option.label.replace(/_/, " ").toLowerCase()}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-6 flex justify-end">
        <Button type="button" onClick={form.handleSubmit(onSubmit, onError)}>
          {isLoading ? "Saving..." : "Save Records"}
        </Button>
      </div>
    </div>
  )
}

function CellInput({
  className,
  ...props
}: ComponentPropsWithRef<typeof Input>) {
  return (
    <Input
      className={cn(
        "h-full w-full rounded-none border-transparent focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0",
        className
      )}
      {...props}
    />
  )
}
