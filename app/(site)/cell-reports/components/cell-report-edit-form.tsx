"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { useSession } from "next-auth/react"
import { Controller, FormProvider, useForm } from "react-hook-form"

import { useDisciplesOfLeader } from "@/hooks/use-disciples-by-leader"
import { useLessonsSeries } from "@/hooks/use-lessons-series"
import { usePrimaryLeaders } from "@/hooks/use-primary-leaders"
import { Button } from "@/components/ui/button"
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
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import Autocomplete from "@/components/autocomplete"
import SectionSpinner from "@/components/section-spinner"
import TagsInput from "@/components/tags-input"
import {
  cellReportCreateSchema,
  CreateCellReportInputs,
} from "@/app/api/cell-reports/schema"

import { CellReportRecord } from "../types"
import AttendeesPicker from "./attendees-picker"

function maptoOptions<T>(dataArr: T[], valueKey: keyof T, labelKey: keyof T) {
  return dataArr
    ? dataArr.map((d) => ({
        value: d[valueKey] as string,
        label: d[labelKey] as string,
      }))
    : []
}

const CellReportEditForm = ({
  cellReport,
}: {
  cellReport: CellReportRecord
}) => {
  const router = useRouter()
  const session = useSession()

  const form = useForm<CreateCellReportInputs>({
    resolver: zodResolver(cellReportCreateSchema),
    mode: "onBlur",
    defaultValues: {
      leaderId: cellReport.leaderId,
      venue: cellReport.venue,
      time: cellReport.time,
      date: format(cellReport.date, "yyyy-MM-dd"),
      assistant_id: cellReport.assistant_id
        ? cellReport.assistant?.disciple_id
        : undefined,
      attendees: cellReport.attendees.map((a) => a.disciple_id),
      scripture_references: cellReport.scripture_references,
      lesson_name: cellReport.lesson_name ?? undefined,
      type: cellReport.type,
      lessonId: cellReport.lessonId ? cellReport.lessonId : undefined,
    },
  })

  const {
    formState: { errors, isSubmitting },
  } = form

  const [withAssistant, setWithAssistant] = useState(() =>
    Boolean(cellReport.assistant_id)
  )

  const [selectedSeries, setSelectedSeries] = useState<
    string | undefined | null
  >(() => (cellReport.lesson ? cellReport.lesson?.lesson_series_id : undefined))

  const leaderId = form.watch("leaderId")
  const selectedLesson = form.watch("lessonId")

  const primaryLeaders = usePrimaryLeaders()
  const lessonsSeries = useLessonsSeries()
  const disciplesOfLeader = useDisciplesOfLeader(leaderId)

  if (session.status !== "authenticated") return <SectionSpinner />

  const isAdmin = session.data?.user?.role === "ADMIN"

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
      if (!lesson_name) {
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

  const onSubmit = async (values: CreateCellReportInputs) => {
    const hasNoError = onError()

    if (!hasNoError) return

    const hasSelectedALesson = values.lessonId ? true : false

    const formData: CreateCellReportInputs = {
      ...values,
      lesson_name: hasSelectedALesson ? undefined : values.lesson_name,
      scripture_references: hasSelectedALesson
        ? undefined
        : values.scripture_references,
    }

    const attendeesData = values.assistant_id
      ? [...values.attendees, values.assistant_id]
      : values.attendees

    const response = await fetch(`/api/cell-reports/${cellReport.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        date: new Date(values.date as string),
        attendees: attendeesData,
      }),
    })

    if (!response?.ok) {
      toast({
        title: "Something went wrong.",
        description:
          "The cell report record was not updated. Please try again.",
        variant: "destructive",
      })

      return
    }

    toast({
      title: "Success!",
      description: "The cell report was updated successfully!",
      variant: "success",
    })

    form.reset()
    router.refresh()
  }

  return (
    <div className="rounded-lg bg-muted p-6 shadow-lg">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onError)}>
          <fieldset
            disabled={isSubmitting}
            className="space-y-3
              disabled:pointer-events-none disabled:opacity-80"
          >
            <p className="pb-3 text-xs uppercase text-muted-foreground">
              General Details
            </p>
            <div className="grid gap-4 lg:grid-cols-2">
              {isAdmin && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="leaderId">Cell Leader</Label>
                  <Controller
                    control={form.control}
                    name="leaderId"
                    render={({ field }) => (
                      <Autocomplete
                        searchText="Search leader"
                        placeholderText="Choose a cell leader"
                        value={field.value}
                        error={!!errors?.leaderId}
                        onChange={(value) => {
                          field.onChange(value)
                          form.setValue("attendees", [])
                        }}
                        options={maptoOptions(
                          primaryLeaders.data ?? [],
                          "id",
                          "name"
                        )}
                      />
                    )}
                  />
                  <FormErrorMessage
                    id="leaderIdError"
                    error={errors.leaderId?.message}
                  />
                </div>
              )}
              <div className="flex flex-col gap-2">
                <Label htmlFor="type">Cell Type</Label>
                <Controller
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <Select
                      name="type"
                      value={field.value === undefined ? "" : field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        className="w-full"
                        aria-invalid={!!errors.type}
                        aria-describedby="cellTypeError"
                      >
                        <SelectValue placeholder="Pick a cell type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Cell Type</SelectLabel>
                          {["SOULWINNING", "OPEN", "DISCIPLESHIP"].map(
                            (cellType) => (
                              <SelectItem key={cellType} value={cellType}>
                                {cellType}
                              </SelectItem>
                            )
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FormErrorMessage
                  id="cellTypeError"
                  error={errors.type?.message}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="venue">Venue</Label>
              <Input
                id="venue"
                placeholder="Venue"
                aria-invalid={!!errors.venue}
                aria-describedby="venueError"
                {...form.register("venue")}
              />
              <FormErrorMessage id="venueError" error={errors.venue?.message} />
            </div>
            <div className="flex gap-3">
              <div className="w-full max-w-xs space-y-2 ">
                <Label htmlFor="date">Date</Label>
                <Input
                  type="date"
                  id="date"
                  placeholder="Date"
                  pattern="\d{4}-\d{2}-\d{2}"
                  max={new Date().toLocaleDateString("en-ca")}
                  aria-invalid={!!errors.date}
                  aria-describedby="dateError"
                  {...form.register("date")}
                />
                <FormErrorMessage id="dateError" error={errors.date?.message} />
              </div>
              <div className="w-full max-w-xs space-y-2 ">
                <Label htmlFor="time">Time</Label>
                <Input
                  type="time"
                  id="time"
                  placeholder="Time"
                  pattern="[0-9]{2}:[0-9]{2}"
                  aria-invalid={!!errors.time}
                  aria-describedby="timeError"
                  {...form.register("time")}
                />
                <FormErrorMessage id="timeError" error={errors.time?.message} />
              </div>
            </div>
            <div className="flex items-center space-x-2 pt-4">
              <Switch
                disabled={!leaderId}
                checked={withAssistant}
                onCheckedChange={(checked) => setWithAssistant(checked)}
              />
              <Label>I have an assistant leader</Label>
            </div>
            {withAssistant && (
              <div className="flex flex-col space-y-2">
                <Label htmlFor="assistant_id">Assistant Leader</Label>
                <Controller
                  control={form.control}
                  name="assistant_id"
                  render={({ field }) => (
                    <Autocomplete
                      searchText="Search disciple"
                      placeholderText="Select assistant leader"
                      value={field.value}
                      onChange={field.onChange}
                      error={!!errors.assistant_id}
                      options={maptoOptions(
                        disciplesOfLeader.data ?? [],
                        "id",
                        "name"
                      )}
                    />
                  )}
                />
                <FormErrorMessage
                  id="assistantIdError"
                  error={errors.assistant_id?.message}
                />
              </div>
            )}
            <p className="inline-block pt-4 text-xs uppercase text-muted-foreground">
              Lesson Details
            </p>
            <Tabs
              defaultValue={
                cellReport.lessonId ? "pick-lesson" : "custom-lesson"
              }
              className="w-full"
              onValueChange={(tab) => {
                form.clearErrors([
                  "lessonId",
                  "lesson_name",
                  "scripture_references",
                ])
                if (tab === "pick-lesson") {
                  setSelectedSeries(cellReport.lesson?.lesson_series_id)
                  form.setValue("lessonId", cellReport.lessonId ?? undefined)

                  form.setValue("lesson_name", undefined)
                  form.setValue("scripture_references", undefined)
                } else {
                  setSelectedSeries(undefined)
                  form.setValue("lessonId", undefined)

                  form.setValue(
                    "lesson_name",
                    cellReport.lesson_name ?? undefined
                  )
                  form.setValue(
                    "scripture_references",
                    cellReport.scripture_references
                  )
                }
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
                  <Autocomplete
                    searchText="Search series"
                    placeholderText="Pick a series"
                    value={selectedSeries ? selectedSeries : undefined}
                    onChange={setSelectedSeries}
                    options={maptoOptions(lessonsSeries.data!, "id", "title")}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="lessonId">Lesson</Label>
                  <Controller
                    control={form.control}
                    name="lessonId"
                    render={({ field }) => (
                      <Autocomplete
                        searchText="Search lesson"
                        placeholderText="Pick a lesson"
                        disabled={!selectedSeries}
                        value={field.value ? field.value : undefined}
                        onChange={field.onChange}
                        error={!!errors.lessonId}
                        options={maptoOptions(lessons, "id", "title")}
                      />
                    )}
                  />
                  <FormErrorMessage
                    id="lessonIdError"
                    error={errors.lessonId?.message}
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
                  <Label htmlFor="lesson_name">Lesson Title</Label>
                  <Input
                    placeholder="Lesson title"
                    {...form.register("lesson_name")}
                    aria-invalid={!!errors.lesson_name}
                    aria-describedby="lessonNameError"
                  />
                  <FormErrorMessage
                    id="lessonNameError"
                    error={errors.lesson_name?.message}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="scripture_references">
                    Scripture References
                  </Label>
                  <Controller
                    control={form.control}
                    name="scripture_references"
                    render={({ field }) => (
                      <TagsInput
                        value={field.value ?? []}
                        onChange={field.onChange}
                        placeholder="Type a verses (ex. John 3:16), then hit 'Enter'"
                        aria-describedby="scriptureRefError"
                        aria-invalid={!!errors.scripture_references}
                      />
                    )}
                  />
                  <FormErrorMessage
                    id="scriptureRefError"
                    error={errors.scripture_references?.message}
                  />
                </div>
              </TabsContent>
            </Tabs>
            <p className="inline-block pt-4 text-xs uppercase text-muted-foreground">
              Attendees
            </p>
            <div className="my-2 space-x-3">
              <Controller
                control={form.control}
                name="attendees"
                render={({ field }) => (
                  <AttendeesPicker
                    attendees={field.value}
                    onAttendeesValueChange={field.onChange}
                    disabled={!leaderId && isAdmin}
                  />
                )}
              />
              <FormErrorMessage
                id="attendeesError"
                error={errors.attendees?.message}
                className="block"
              />
            </div>
            <div className="flex items-center gap-2 pt-10">
              <Button variant="ghost" type="reset" disabled={isSubmitting}>
                Reset
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Submit Report"}
              </Button>
            </div>
          </fieldset>
        </form>
      </FormProvider>
    </div>
  )
}

export default CellReportEditForm
