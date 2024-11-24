"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Disciple } from "@prisma/client"
import { format } from "date-fns"
import { CheckIcon, XIcon } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { Controller, useFieldArray, useForm } from "react-hook-form"

import { cn } from "@/lib/utils"
import { usePrimaryLeaders } from "@/hooks/use-primary-leaders"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { NativeSelect } from "@/components/ui/native-select"
import { SubmitButton } from "@/components/ui/submit-button"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"

import { createAttendance } from "./actions"
import {
  CreateAttendanceRecordInputs,
  createAttendanceRecordSchema,
} from "./schema"

export function AttendanceRecordForm({
  onAfterSave,
  processLessonId,
  processAttendancePeriodId,
  students,
}: {
  onAfterSave: () => void
  processLessonId: string
  processAttendancePeriodId: string
  students: Disciple[]
}) {
  const primaryLeaders = usePrimaryLeaders(true)

  const { toast } = useToast()

  const form = useForm<CreateAttendanceRecordInputs>({
    defaultValues: {
      teacher_id: "",
      date: format(new Date(), "yyyy-MM-dd"),
      process_lesson_id: processLessonId,
      processAttendancePeriodId: processAttendancePeriodId,
      process_attendees: [],
    },
    resolver: zodResolver(createAttendanceRecordSchema),
  })

  const studentFields = useFieldArray({
    control: form.control,
    name: "process_attendees",
  })

  const [step, setStep] = useState(1)

  const action = useAction(createAttendance, {
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
        description: "The attendance record was created successfully!",
        variant: "success",
      })
    },
  })

  const presentAttendees = form
    .watch("process_attendees")
    .map((a) => a.disciple_id)

  function onError(errors: typeof form.formState.errors) {
    console.log(errors)
  }

  async function onSubmit(values: CreateAttendanceRecordInputs) {
    const result = await action.executeAsync(values)
    if (result?.data?.attendance?.id) {
      onAfterSave()
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="relative flex max-h-[calc(100%-88px)] flex-1 flex-col"
      >
        {step === 1 ? (
          <div className="max-h-[calc(100%-69px)] flex-1 overflow-y-auto py-4">
            <fieldset
              className="space-y-3 px-4 disabled:opacity-90"
              disabled={action.isPending}
            >
              <legend className="text-sm font-medium">
                Process Attendance Details
              </legend>
              <input
                type="text"
                hidden
                defaultValue={processLessonId}
                {...form.register("process_lesson_id")}
              />
              <input
                type="text"
                hidden
                defaultValue={processAttendancePeriodId}
                {...form.register("processAttendancePeriodId")}
              />
              <FormField
                control={form.control}
                name="teacher_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teacher</FormLabel>
                    <FormControl>
                      <NativeSelect
                        {...field}
                        disabled={primaryLeaders.isLoading}
                      >
                        <option value="">Select teacher</option>
                        {primaryLeaders?.data?.map((item) => (
                          <option key={`teacher-${item.id}`} value={item.id}>
                            {item.name}
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
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        id="date"
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

              <p className="text-sm font-medium">
                Select the students who attended the session.
              </p>
              <div>
                {students?.length ? (
                  <section className="mb-6 border-y">
                    <div className="flex items-center justify-between border-b bg-muted/20 px-2.5 py-3">
                      <h3 className="text-xs font-medium text-blue-500">
                        Selected ({presentAttendees.length})
                      </h3>
                      <Button
                        type="button"
                        size="sm"
                        variant="link"
                        className="hidden text-blue-500 no-underline"
                        disabled={students.length === presentAttendees.length}
                        onClick={() => {}}
                      >
                        Select All
                      </Button>
                    </div>
                    <ul className="max-h-[300px] w-full divide-y overflow-y-auto">
                      {students?.map((d) => (
                        <li key={`student-${d.id}`}>
                          <button
                            title={
                              presentAttendees.includes(d.id)
                                ? "click to deselect"
                                : "click to select"
                            }
                            type="button"
                            onClick={() => {
                              if (presentAttendees.includes(d.id)) {
                                const index = presentAttendees.findIndex(
                                  (p) => p === d.id
                                )
                                studentFields.remove(index)
                              } else {
                                studentFields.append({
                                  disciple_id: d.id,
                                  devo: 0,
                                  remarks: undefined,
                                  with_assignment: true,
                                })
                              }
                            }}
                            className={cn(
                              "inline-flex w-full items-center justify-between gap-3 p-2.5 transition-colors hover:bg-muted",
                              presentAttendees.includes(d.id)
                                ? "bg-muted/30"
                                : ""
                            )}
                          >
                            <span className="text-sm text-foreground">
                              {d.name}
                            </span>
                            {presentAttendees.includes(d.id) ? (
                              <CheckIcon size={16} className="text-green-500" />
                            ) : (
                              <XIcon size={16} className="text-red-500" />
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null}
              </div>
            </fieldset>
          </div>
        ) : (
          <div className="max-h-[calc(100%-69px)] flex-1 overflow-y-auto py-4">
            <div className="px-4">
              <p className="mb-2 text-sm font-medium">
                Next, add additional records:
              </p>
              <p className="mb-4 text-xs text-muted-foreground">
                Check{" "}
                <span className="font-medium italic">With Assignment</span> if
                no assignment was given.
              </p>
            </div>

            <Table className="border-t">
              <TableHeader>
                <TableRow>
                  <TableHead className="h-10">Name</TableHead>
                  <TableHead className="h-10"># Devo</TableHead>
                  <TableHead className="h-10">With Assignment?</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="[&_tr:last-child]:border-b">
                {studentFields.fields.map((student, idx) => (
                  <TableRow key={`student-field-${student.disciple_id}`}>
                    <TableCell className="border-r">
                      {students.find((d) => d.id === student.disciple_id)?.name}
                    </TableCell>
                    <TableCell className="w-[90px] p-0.5">
                      <FormField
                        control={form.control}
                        name={`process_attendees.${idx}.devo`}
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <FormLabel className="sr-only">
                              Number of Journal
                            </FormLabel>
                            <FormControl>
                              <Input
                                aria-label=""
                                type="number"
                                inputMode="numeric"
                                onWheel={(e) => e.currentTarget.blur()}
                                min={0}
                                className="rounded-none bg-transparent text-center"
                                value={field.value?.toString() ?? "0"}
                                onChange={(e) => {
                                  field.onChange(e.currentTarget.valueAsNumber)
                                }}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell className="w-[90px] p-0.5 text-center">
                      <Controller
                        control={form.control}
                        name={`process_attendees.${idx}.with_assignment`}
                        render={({ field }) => (
                          <Switch
                            aria-label="did this disciple pass his/her assignment?"
                            checked={Boolean(field.value)}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {step === 1 ? (
          <div className="mt-auto flex flex-col gap-3 border-t p-4 text-right md:flex-row md:items-center">
            <Button
              variant="outline"
              type="reset"
              className="bg-muted/30 md:ml-auto"
              onClick={() => {
                form.reset()
              }}
            >
              Reset
            </Button>
            <Button
              type="button"
              disabled={presentAttendees.length === 0}
              onClick={() => {
                setStep(2)
              }}
            >
              Next
            </Button>
          </div>
        ) : (
          <div className="mt-auto flex flex-col gap-3 border-t p-4 text-right md:flex-row md:items-center">
            <Button
              variant="outline"
              type="button"
              disabled={action.isExecuting}
              className="bg-muted/30 md:ml-auto"
              onClick={() => {
                setStep(1)
              }}
            >
              Back
            </Button>
            <SubmitButton type="submit" loading={action.isPending}>
              Save Record
            </SubmitButton>
          </div>
        )}
      </form>
    </Form>
  )
}
