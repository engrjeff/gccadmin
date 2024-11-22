"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { useSession } from "next-auth/react"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"

import { useDisciplesOfLeader } from "@/hooks/use-disciples-by-leader"
import { usePrimaryLeaders } from "@/hooks/use-primary-leaders"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect } from "@/components/ui/native-select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { SubmitButton } from "@/components/ui/submit-button"
import { useToast } from "@/components/ui/use-toast"

import { updateDisciple } from "./actions"
import {
  cellStatuses,
  churchStatuses,
  processLevels,
  processLevelStatuses,
} from "./constants"
import {
  DiscipleRecord,
  DiscipleUpdateInputs,
  discipleUpdateSchema,
} from "./schema"

interface DiscipleEditFormProps {
  disciple: DiscipleRecord
  onAfterSave: () => void
}

export function DiscipleEditForm({
  disciple,
  onAfterSave,
}: DiscipleEditFormProps) {
  const primaryLeaders = usePrimaryLeaders()
  const session = useSession()

  const { toast } = useToast()

  const form = useForm<DiscipleUpdateInputs>({
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
      handled_by_id: disciple.handled_by_id ?? undefined,
    },
    mode: "onChange",
    resolver: zodResolver(discipleUpdateSchema),
  })

  const action = useAction(updateDisciple, {
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

  const user = session.data?.user
  const isAdmin = user?.role === "ADMIN"
  const leaderId = user?.discipleId

  const { errors: formErrors } = form.formState

  const disciplesOfLeader = useDisciplesOfLeader(
    isAdmin ? form.watch("leaderId") : session.data?.user.discipleId
  )

  const onSubmit = async (values: DiscipleUpdateInputs) => {
    const result = await action.executeAsync({ id: disciple.id, ...values })
    if (result?.data?.disciple?.id) {
      onAfterSave()
    }
  }

  const onError = (errors: typeof formErrors) => {
    console.error(errors)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="relative flex max-h-[calc(100%-88px)] flex-1 flex-col"
      >
        <div className="max-h-[calc(100%-69px)] flex-1 overflow-y-auto py-4">
          <fieldset
            className="space-y-3 px-4 disabled:opacity-90"
            disabled={action.isPending}
          >
            <legend className="text-sm font-medium">
              Personal Information
            </legend>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Disciple's name" {...field} autoFocus />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birthdate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Birthdate</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      max="2015-12-31"
                      pattern="\d{4}-\d{2}-\d{2}"
                      className="w-min"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="member_type"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>Member Type</FormLabel>
                  <FormControl>
                    <NativeSelect {...field}>
                      <option value="KIDS">Kids</option>
                      <option value="YOUTH">Youth</option>
                      <option value="YOUNGPRO">Young Pro</option>
                      <option
                        disabled={form.watch("gender") === "FEMALE"}
                        value="MEN"
                      >
                        Men
                      </option>
                      <option
                        disabled={form.watch("gender") === "MALE"}
                        value="WOMEN"
                      >
                        Women
                      </option>
                    </NativeSelect>
                  </FormControl>
                  <FormDescription>
                    What category best describes this disciple?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <RadioGroup
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
                      value={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-3 space-y-0">
                        <RadioGroupItem value="MALE" id="MALE" />
                        <Label htmlFor="MALE" className="font-normal">
                          Male
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 space-y-0">
                        <RadioGroupItem value="FEMALE" id="FEMALE" />
                        <Label htmlFor="FEMALE" className="font-normal">
                          Female
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </fieldset>
          <Separator className="my-6" />
          <fieldset
            className="space-y-3 px-4 disabled:opacity-90"
            disabled={action.isPending}
          >
            <legend className="text-sm font-medium">
              Church-related Information
            </legend>

            {isAdmin ? (
              <FormField
                control={form.control}
                name="leaderId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Leader</FormLabel>
                    <FormControl>
                      <NativeSelect
                        {...field}
                        disabled={primaryLeaders.isLoading}
                      >
                        <option value="" disabled>
                          Select Leader
                        </option>
                        {primaryLeaders?.data?.map((item) => (
                          <option key={`leader-${item.id}`} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </NativeSelect>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <input
                hidden
                defaultValue={leaderId}
                {...form.register("leaderId")}
              />
            )}

            {!disciple.isMyPrimary && !disciple.isPrimary ? (
              <FormField
                control={form.control}
                name="handled_by_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Handled By{" "}
                      <span className="text-xs italic text-muted-foreground">
                        Optional
                      </span>
                    </FormLabel>
                    <FormControl>
                      <NativeSelect
                        className="normal-case"
                        id="handled_by_id"
                        {...field}
                      >
                        <option value="">Select cell leader</option>
                        {disciplesOfLeader.data
                          ?.filter((dc) => dc.isMyPrimary)
                          ?.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                      </NativeSelect>
                    </FormControl>
                    <FormDescription>
                      Who handles this disciple?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="cell_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cell Status</FormLabel>
                    <FormControl>
                      <NativeSelect {...field}>
                        <option value="" disabled>
                          Select Cell Status
                        </option>
                        {cellStatuses.map((item) => (
                          <option
                            key={`cell-status-${item.value}`}
                            value={item.value}
                          >
                            {item.label}
                          </option>
                        ))}
                      </NativeSelect>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="church_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Church Status</FormLabel>
                    <FormControl>
                      <NativeSelect {...field}>
                        <option value="" disabled>
                          Select Church Status
                        </option>
                        {churchStatuses.map((item) => (
                          <option
                            key={`church-status-${item.value}`}
                            value={item.value}
                          >
                            {item.label}
                          </option>
                        ))}
                      </NativeSelect>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="process_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Process Level</FormLabel>
                    <FormControl>
                      <NativeSelect {...field}>
                        <option value="" disabled>
                          Select Process Level
                        </option>
                        {processLevels.map((item) => (
                          <option
                            key={`process-level-${item.value}`}
                            value={item.value}
                          >
                            {item.label}
                          </option>
                        ))}
                      </NativeSelect>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="process_level_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Process Status</FormLabel>
                    <FormControl>
                      <NativeSelect {...field}>
                        <option value="" disabled>
                          Select Process Status
                        </option>
                        {processLevelStatuses.map((item) => (
                          <option
                            key={`process-status-${item.value}`}
                            value={item.value}
                          >
                            {item.label}
                          </option>
                        ))}
                      </NativeSelect>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </fieldset>
        </div>

        <div className="mt-auto flex items-center gap-3 border-t p-4 text-right">
          <Button
            variant="outline"
            type="button"
            disabled={action.isPending}
            className="ml-auto bg-muted/30"
            onClick={onAfterSave}
          >
            Cancel
          </Button>
          <SubmitButton type="submit" loading={action.isPending}>
            Save Changes
          </SubmitButton>
        </div>
      </form>
    </Form>
  )
}
