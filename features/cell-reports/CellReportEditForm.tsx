"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { useSession } from "next-auth/react"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"

import { useCellReports } from "@/hooks/use-cell-reports"
import { useDisciplesOfLeader } from "@/hooks/use-disciples-by-leader"
import { useLessonsSeries } from "@/hooks/use-lessons-series"
import { usePrimaryLeaders } from "@/hooks/use-primary-leaders"
import { useWeeklyCellGroups } from "@/hooks/use-weekly-cellgroups"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect } from "@/components/ui/native-select"
import { Separator } from "@/components/ui/separator"
import { SubmitButton } from "@/components/ui/submit-button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { AppCombobox } from "@/components/app-combobox"
import TagsInput from "@/components/tags-input"

import { updateCellReport } from "./actions"
import { AttendeesPicker } from "./AttendeesPicker"
import { cellReportCreateSchema, CreateCellReportInputs } from "./schema"
import { CellReportRecord } from "./types"

function maptoOptions<T>(dataArr: T[], valueKey: keyof T, labelKey: keyof T) {
  return dataArr
    ? dataArr.map((d) => ({
        value: d[valueKey] as string,
        label: d[labelKey] as string,
      }))
    : []
}

export function CellReportEditForm({
  cellReport,
  onAfterSave,
}: {
  cellReport: CellReportRecord
  onAfterSave: () => void
}) {
  const session = useSession()

  const { refetch: refetchCellGroups } = useCellReports()
  const { refetch: refectchWeeklyReports } = useWeeklyCellGroups()

  const isAdmin = session.data?.user?.role === "ADMIN"

  const primaryLeaders = usePrimaryLeaders()
  const lessonsSeries = useLessonsSeries()

  const { toast } = useToast()

  const action = useAction(updateCellReport, {
    onError({ error }) {
      toast({
        title: "Something went wrong.",
        description:
          "The cell report record was not updated. Please try again.",
        variant: "destructive",
      })
    },
    onSuccess() {
      toast({
        title: "Success!",
        description: "The cell report was updated successfully!",
        variant: "success",
      })
    },
  })

  const [withAssistant, setWithAssistant] = useState(() =>
    cellReport.assistant_id ? true : false
  )
  const [selectedSeries, setSelectedSeries] = useState<string | undefined>(
    () => cellReport.lesson?.lesson_series_id ?? undefined
  )

  const form = useForm<CreateCellReportInputs>({
    resolver: zodResolver(cellReportCreateSchema),
    defaultValues: {
      leaderId: cellReport.leaderId,
      venue: cellReport.venue,
      attendees: cellReport.attendees
        .map((d) => d.disciple_id)
        .filter((a) => a !== cellReport.assistant?.disciple_id),
      type: cellReport.type,
      scripture_references: cellReport.scripture_references,
      lesson_name: cellReport.lessonId ? "" : cellReport.lesson_name!,
      assistant_id: cellReport.assistant?.disciple_id ?? "",
      date: format(new Date(cellReport.date), "yyyy-MM-dd"),
      time: cellReport.time,
      lessonId: cellReport.lesson_name ? "" : cellReport.lessonId!,
    },
  })

  const { formState } = form

  const leaderId = form.watch("leaderId")
  const selectedLesson = form.watch("lessonId")
  const attendees = form.watch("attendees")

  useEffect(() => {
    if (!session.data?.user || isAdmin) return

    form.setValue("leaderId", session.data.user.discipleId!)
  }, [form, isAdmin, session.data?.user])

  const disciplesOfLeader = useDisciplesOfLeader(
    isAdmin ? leaderId : session.data?.user.discipleId
  )

  const lessons =
    lessonsSeries.data?.find((i) => i.id === selectedSeries)?.lessons ?? []

  const referencesFromLessons =
    lessons
      .find((i) => i.id === selectedLesson)
      ?.scripture_references.join(", ") ?? ""

  const onError = () => {
    const { lessonId, lesson_name, assistant_id, scripture_references } =
      form.watch()

    if (withAssistant && !assistant_id) {
      form.setError("assistant_id", { message: "Assistant is required." })
      return false
    }

    if (!lessonId && !lesson_name) {
      form.setError("lessonId", { message: "Lesson is required" })
      form.setError("lesson_name", { message: "Lesson is required" })
      return false
    }

    if (!lessonId) {
      if (!form.watch("lesson_name")) {
        form.setError("lesson_name", { message: "Lesson is required" })
        return false
      }

      if (!scripture_references || scripture_references?.length === 0) {
        form.setError("scripture_references", {
          message: "Scripture reference is required",
        })
        return false
      }
    }

    return true
  }

  async function onSubmit(values: CreateCellReportInputs) {
    const hasNoError = onError()

    if (!hasNoError) return

    const attendeesData = Array.from(
      new Set(
        values.assistant_id
          ? values.attendees?.concat([values.assistant_id])
          : values.attendees
      )
    )

    const result = await action.executeAsync({
      id: cellReport.id,
      ...values,
      lessonId: values.lesson_name ? "" : values.lessonId,
      lesson_name: values.lessonId ? "" : values.lesson_name,
      scripture_references: values.lessonId ? [] : values.scripture_references,
      attendees: attendeesData,
    })

    if (result?.data?.cellReport?.id) {
      onAfterSave()

      await refetchCellGroups()
      await refectchWeeklyReports()
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
            <legend className="text-sm font-medium">General Details</legend>
            {isAdmin ? (
              <FormField
                control={form.control}
                name="leaderId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Leader</FormLabel>
                    <FormControl>
                      <NativeSelect
                        className="normal-case"
                        id="leaderId"
                        disabled
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.currentTarget.value)
                          form.setValue("attendees", [])
                        }}
                      >
                        <option disabled value="">
                          Select a leader
                        </option>
                        {primaryLeaders.data?.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </NativeSelect>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>Cell Type</FormLabel>
                  <FormControl>
                    <NativeSelect className="normal-case" id="type" {...field}>
                      <option value="OPEN">Open Cell</option>
                      <option value="DISCIPLESHIP">Discipleship Cell</option>
                      <option value="SOULWINNING">Soul Winning</option>
                    </NativeSelect>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="venue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Venue</FormLabel>
                  <FormControl>
                    <Input id="venue" placeholder="Venue" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-start gap-4">
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
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        id="time"
                        placeholder="Time"
                        pattern="[0-9]{2}:[0-9]{2}"
                        className="w-min"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center space-x-2 pt-4">
              <Checkbox
                disabled={!leaderId && isAdmin}
                checked={withAssistant}
                onCheckedChange={(checked) => {
                  setWithAssistant(checked === true ? true : false)
                  if (checked !== true) {
                    form.setValue("assistant_id", "")
                  }
                }}
                id="with-assistant"
              />
              <Label htmlFor="with-assistant">I have an assistant leader</Label>
            </div>

            {withAssistant ? (
              <FormField
                control={form.control}
                name="assistant_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assistant Leader</FormLabel>
                    <FormControl>
                      <NativeSelect
                        key={disciplesOfLeader.data?.length}
                        className="normal-case"
                        id="assistant_id"
                        {...field}
                        onChange={(e) => {
                          if (e.currentTarget.value) {
                            // remove the assistant from attendees if
                            // the selected assistant is not equal to
                            // the cell report initial assistant
                            if (
                              cellReport.assistant?.disciple_id !==
                              e.currentTarget.value
                            ) {
                              form.setValue(
                                "attendees",
                                attendees.filter(
                                  (a) => a !== e.currentTarget.value
                                )
                              )
                            }

                            field.onChange(e)
                          }
                        }}
                      >
                        <option value="">Select assistant leader</option>
                        {disciplesOfLeader.data
                          ?.filter((dc) => dc.isMyPrimary)
                          ?.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                      </NativeSelect>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}
          </fieldset>
          <Separator className="my-6" />
          <fieldset
            className="space-y-3 px-4 disabled:opacity-90"
            disabled={action.isPending}
          >
            <legend className="text-sm font-medium">Lesson Details</legend>

            <Tabs
              defaultValue={
                cellReport.lesson_name ? "custom-lesson" : "pick-lesson"
              }
              className="w-full"
              onValueChange={() => {
                setSelectedSeries(undefined)
                form.setValue("lessonId", undefined)
                form.setValue("lesson_name", undefined)
                form.setValue("scripture_references", [])
              }}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pick-lesson">Pick a Lesson</TabsTrigger>
                <TabsTrigger value="custom-lesson">Custom Lesson</TabsTrigger>
              </TabsList>
              <TabsContent
                value="pick-lesson"
                className="space-y-3 rounded-lg border p-3"
              >
                <div className="flex flex-col space-y-2">
                  <Label>Series</Label>
                  <AppCombobox
                    key={lessonsSeries.data?.length}
                    fullwidth
                    label="Select Series"
                    value={selectedSeries}
                    onValueChange={setSelectedSeries}
                    options={maptoOptions(lessonsSeries.data!, "id", "title")}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <FormField
                    control={form.control}
                    name="lessonId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lesson</FormLabel>
                        <FormControl>
                          <AppCombobox
                            key={lessons.length}
                            fullwidth
                            disabled={!selectedSeries}
                            label="Select Lesson"
                            value={field.value}
                            onValueChange={field.onChange}
                            options={maptoOptions(lessons, "id", "title")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <Label>Scripture References</Label>
                  <Textarea
                    placeholder="Scripture references"
                    disabled
                    defaultValue={referencesFromLessons}
                  />
                </div>
              </TabsContent>
              <TabsContent
                value="custom-lesson"
                className="space-y-3 rounded-lg border p-3"
              >
                <div className="w-full space-y-2">
                  <FormField
                    control={form.control}
                    name="lesson_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lesson Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Lesson title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <FormField
                    control={form.control}
                    name="scripture_references"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Scripture References</FormLabel>
                        <FormControl>
                          <TagsInput
                            value={field.value ?? []}
                            onChange={field.onChange}
                            placeholder="Scriptures"
                            hintText="Type a verses (ex. John 3:16), then hit 'Enter'"
                            aria-describedby="scriptureRefError"
                            aria-invalid={
                              !!formState.errors?.scripture_references
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>
            <FormField
              control={form.control}
              name="attendees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attendees</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <AttendeesPicker />
                  </FormControl>
                </FormItem>
              )}
            />
          </fieldset>
        </div>

        <div className="mt-auto flex flex-col gap-3 border-t p-4 text-right md:flex-row md:items-center">
          <Button
            variant="outline"
            type="button"
            disabled={false}
            className="bg-muted/30 md:ml-auto"
            onClick={onAfterSave}
            // onClick={() => {
            //   form.reset({
            //     leaderId: cellReport.leaderId,
            //     venue: cellReport.venue,
            //     attendees: cellReport.attendees
            //       .map((d) => d.disciple_id)
            //       .filter((a) => a !== cellReport.assistant?.disciple_id),
            //     type: cellReport.type,
            //     scripture_references: cellReport.scripture_references,
            //     lesson_name: cellReport.lessonId ? "" : cellReport.lesson_name!,
            //     assistant_id: cellReport.assistant?.disciple_id ?? "",
            //     date: format(new Date(cellReport.date), "yyyy-MM-dd"),
            //     time: cellReport.time,
            //     lessonId: cellReport.lesson_name ? "" : cellReport.lessonId!,
            //   })

            //   setSelectedSeries(
            //     cellReport.lesson?.lesson_series_id ?? undefined
            //   )
            //   setWithAssistant(cellReport.assistant_id ? true : false)
            // }}
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
