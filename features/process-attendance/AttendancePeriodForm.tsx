"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"

import { removeUnderscores } from "@/lib/utils"
import { useEncounterBatchList } from "@/hooks/use-encounter-batch-list"
import { useProcessSeriesList } from "@/hooks/use-process-series-list"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { SubmitButton } from "@/components/ui/submit-button"
import { useToast } from "@/components/ui/use-toast"

import { processLevels } from "../disciples/constants"
import { createAttendancePeriod } from "./actions"
import { MoreStudentsPicker } from "./MoreStudentsPicker"
import {
  CreateAttendancePeriodInputs,
  createAttendancePeriodSchema,
} from "./schema"

const initialValues: CreateAttendancePeriodInputs = {
  description: "",
  startDate: "",
  endDate: "",
  students: [],
  //@ts-ignore
  processLevel: "",
  processLessonSeriesId: "",
}

export function AttendancePeriodForm({
  onAfterSave,
}: {
  onAfterSave: () => void
}) {
  const form = useForm<CreateAttendancePeriodInputs>({
    defaultValues: initialValues,
    resolver: zodResolver(createAttendancePeriodSchema),
  })
  const [selectedBatch, setSelectedBatch] = useState<string>("")
  const [addMoreStudents, setAddMoreStudents] = useState(false)

  const encounterBatchList = useEncounterBatchList()

  const processSeriesList = useProcessSeriesList()

  const { toast } = useToast()

  const action = useAction(createAttendancePeriod, {
    onError({ error }) {
      toast({
        title: "Something went wrong.",
        description: "The record was not created. Please try again.",
        variant: "destructive",
      })
    },
    onSuccess() {
      toast({
        title: "Success!",
        description: "The Attendance Period was created successfully!",
        variant: "success",
      })
    },
  })

  const processLevel = form.watch("processLevel")

  const selectedBatchRecord = encounterBatchList.data?.find(
    (b) => b.id === selectedBatch
  )

  useEffect(() => {
    if (processLevel && selectedBatch) {
      form.setValue(
        "description",
        `${selectedBatchRecord?.batchName}: ${removeUnderscores(
          processLevel
        ).toUpperCase()}`
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processLevel, selectedBatch])

  useEffect(() => {
    if (processLevel) {
      const selectedProcessLessonSeries = processSeriesList.data?.find(
        (p) => p.processLevel === processLevel
      )

      if (selectedProcessLessonSeries) {
        form.setValue("processLessonSeriesId", selectedProcessLessonSeries.id)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processLevel])

  function onError(errors: typeof form.formState.errors) {
    console.log(errors)
  }

  async function onSubmit(values: CreateAttendancePeriodInputs) {
    const result = await action.executeAsync(values)

    if (result?.data?.period?.id) {
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
            <legend className="text-sm font-medium">
              Process Attendance Period Details
            </legend>

            <div className="space-y-2">
              <Label htmlFor="encounter-batch">Encounter Batch</Label>
              <NativeSelect
                id="encounter-batch"
                disabled={encounterBatchList.isLoading}
                value={selectedBatch}
                onChange={(e) => {
                  setSelectedBatch(e.currentTarget.value)

                  const selectedBatchRecord = encounterBatchList.data?.find(
                    (b) => b.id === e.currentTarget.value
                  )

                  form.setValue(
                    "students",
                    selectedBatchRecord?.members.map((m) => m.id) ?? []
                  )
                }}
              >
                <option value="">Select Encounter Batch</option>
                {encounterBatchList.data?.map((batch) => (
                  <option key={`encounter-batch-${batch.id}`} value={batch.id}>
                    {batch.batchName}
                  </option>
                ))}
              </NativeSelect>
            </div>

            <FormField
              control={form.control}
              name="processLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Process Level</FormLabel>
                  <FormControl>
                    <NativeSelect {...field}>
                      <option value="">Select Process Level</option>
                      {processLevels
                        .filter((i) => i.value.startsWith("LEAD"))
                        .map((item) => (
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      id="description"
                      placeholder="Description"
                      disabled
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A way to remember this record.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="processLessonSeriesId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Process Series</FormLabel>
                  <FormControl>
                    <NativeSelect {...field}>
                      <option value="">Select Process Series</option>
                      {processSeriesList.data?.map((item) => (
                        <option
                          key={`process-series-${item.id}`}
                          value={item.id}
                        >
                          Series: {item.title}
                        </option>
                      ))}
                    </NativeSelect>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

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
                        className="w-min"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center space-x-2 pt-4">
                <Checkbox
                  checked={addMoreStudents}
                  disabled={!processLevel}
                  onCheckedChange={(checked) => {
                    setAddMoreStudents(checked === true ? true : false)
                  }}
                  id="add-more-students"
                />
                <Label htmlFor="add-more-students">Add more students</Label>
              </div>

              {addMoreStudents ? (
                <MoreStudentsPicker
                  initialAttendees={selectedBatchRecord?.members}
                />
              ) : null}
            </div>
          </fieldset>
        </div>

        <div className="mt-auto flex flex-col gap-3 border-t p-4 text-right md:flex-row md:items-center">
          <Button
            variant="outline"
            type="reset"
            disabled={false}
            className="bg-muted/30 md:ml-auto"
            onClick={() => {
              form.reset(initialValues)
            }}
          >
            Reset
          </Button>
          <SubmitButton type="submit" loading={action.isPending}>
            Save Record
          </SubmitButton>
        </div>
      </form>
    </Form>
  )
}
