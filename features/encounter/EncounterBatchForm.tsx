"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { addDays, format, isValid } from "date-fns"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"

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
import { Separator } from "@/components/ui/separator"
import { SubmitButton } from "@/components/ui/submit-button"
import { useToast } from "@/components/ui/use-toast"

import { createEncounterBatch } from "./actions"
import { EncounterParticipantsPicker } from "./EncounterParticipantsPicker"
import {
  CreateEncounterBatchInputs,
  createEncounterBatchSchema,
} from "./schema"

export function EncounterBatchForm({
  onAfterSave,
}: {
  onAfterSave: () => void
}) {
  const { toast } = useToast()

  const action = useAction(createEncounterBatch, {
    onError({ error }) {
      if (error.serverError === "Encounter batch name must be unique.") {
        form.setFocus("batchName")
        form.setError("batchName", { message: error.serverError })
        return
      }

      toast({
        title: "Something went wrong.",
        description: "The record was not created. Please try again.",
        variant: "destructive",
      })
    },
    onSuccess() {
      toast({
        title: "Success!",
        description: "The Encounter Batch was created successfully!",
        variant: "success",
      })
    },
  })

  const form = useForm<CreateEncounterBatchInputs>({
    defaultValues: {
      batchName: "",
      startDate: format(new Date(), "yyyy-MM-dd"),
      endDate: format(new Date(), "yyyy-MM-dd"),
      members: [],
    },
    resolver: zodResolver(createEncounterBatchSchema),
  })

  function onError(errors: typeof form.formState.errors) {
    console.log(errors)
  }

  async function onSubmit(values: CreateEncounterBatchInputs) {
    const result = await action.executeAsync(values)

    if (result?.data?.batch?.id) {
      onAfterSave()
    }
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
            <legend className="text-sm font-medium">Basic Details</legend>
            <FormField
              control={form.control}
              name="batchName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Batch Name</FormLabel>
                  <FormControl>
                    <Input id="batchName" placeholder="Batch name" {...field} />
                  </FormControl>
                  <FormDescription>
                    A descriptive name to easily remember this batch.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        id="startDate"
                        placeholder="Date"
                        pattern="\d{4}-\d{2}-\d{2}"
                        max={new Date().toLocaleDateString("en-ca")}
                        className="w-min"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)

                          if (e.currentTarget.value) {
                            if (isValid(e.currentTarget.valueAsDate)) {
                              form.setValue(
                                "endDate",
                                format(
                                  addDays(new Date(e.currentTarget.value), 1),
                                  "yyyy-MM-dd"
                                )
                              )
                            }
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        id="endDate"
                        placeholder="Date"
                        pattern="\d{4}-\d{2}-\d{2}"
                        max={new Date().toLocaleDateString("en-ca")}
                        className="w-min"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </fieldset>
          <Separator className="mb-4 mt-6" />
          <fieldset
            className="px-4 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-90"
            disabled={action.isPending}
          >
            <FormField
              control={form.control}
              name="members"
              render={({ field }) => (
                <FormItem>
                  <div>
                    <FormLabel>Participants</FormLabel>
                    <FormDescription>
                      Select from the list below.
                    </FormDescription>
                  </div>
                  <FormMessage />
                  <FormControl>
                    <EncounterParticipantsPicker />
                  </FormControl>
                </FormItem>
              )}
            />
          </fieldset>
        </div>
        <div className="mt-auto flex flex-col gap-3 border-t p-4 text-right md:flex-row md:items-center">
          <Button
            variant="outline"
            type="reset"
            disabled={false}
            className="bg-muted/30 md:ml-auto"
            onClick={() => {
              form.reset()
            }}
          >
            Reset
          </Button>
          <SubmitButton type="submit" loading={action.isPending}>
            Save Batch
          </SubmitButton>
        </div>
      </form>
    </Form>
  )
}
