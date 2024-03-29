"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"
import { Controller, FormProvider, useForm } from "react-hook-form"

import { useDisciplesOfLeader } from "@/hooks/use-disciples-by-leader"
import { useLessonsSeries } from "@/hooks/use-lessons-series"
import { usePrimaryLeaders } from "@/hooks/use-primary-leaders"
import { Button } from "@/components/ui/button"
import FormErrorMessage from "@/components/ui/form-error-message"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect } from "@/components/ui/native-select"
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

import AttendeesPicker from "./attendees-picker"

function maptoOptions<T>(dataArr: T[], valueKey: keyof T, labelKey: keyof T) {
  return dataArr
    ? dataArr.map((d) => ({
        value: d[valueKey] as string,
        label: d[labelKey] as string,
      }))
    : []
}

const CellReportForm = () => {
  const router = useRouter()
  const session = useSession()

  const isAdmin = session.data?.user?.role === "ADMIN"

  const form = useForm<CreateCellReportInputs>({
    resolver: zodResolver(cellReportCreateSchema),
    defaultValues: {
      attendees: [],
      scripture_references: [],
      type: undefined,
    },
  })

  const {
    formState: { errors, isSubmitting },
  } = form

  const [withAssistant, setWithAssistant] = useState(false)

  const [selectedSeries, setSelectedSeries] = useState<string>()

  const leaderId = form.watch("leaderId")
  const selectedLesson = form.watch("lessonId")

  const primaryLeaders = usePrimaryLeaders()
  const lessonsSeries = useLessonsSeries()

  const disciplesOfLeader = useDisciplesOfLeader(
    isAdmin ? leaderId : session.data?.user.discipleId
  )

  useEffect(() => {
    if (!session.data?.user || isAdmin) return

    form.setValue("leaderId", session.data.user.discipleId!)
  }, [form, isAdmin, session.data?.user])

  if (session.status !== "authenticated") return <SectionSpinner />

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

  const onSubmit = async (values: CreateCellReportInputs) => {
    const hasNoError = onError()

    if (!hasNoError) return

    const attendeesData = values.assistant_id
      ? [...values.attendees, values.assistant_id]
      : values.attendees

    const response = await fetch("/api/cell-reports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...values,
        date: new Date(values.date as string),
        attendees: attendeesData,
      }),
    })

    if (!response?.ok) {
      toast({
        title: "Something went wrong.",
        description:
          "The cell report record was not created. Please try again.",
        variant: "destructive",
      })

      return
    }

    toast({
      title: "Success!",
      description: "The cell report was created successfully!",
      variant: "success",
    })

    form.reset()

    if (!isAdmin) {
      form.setValue("leaderId", session.data.user.discipleId!)
    }

    setWithAssistant(false)
    setSelectedSeries(undefined)
    router.refresh()
  }

  return (
    <div className="rounded-lg shadow-lg md:border md:p-6">
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
              <div className="flex flex-col gap-2">
                <Label htmlFor="leaderId">Cell Leader</Label>

                <Controller
                  control={form.control}
                  name="leaderId"
                  render={({ field }) => (
                    <>
                      <NativeSelect
                        disabled={!isAdmin}
                        key={form.watch("leaderId")}
                        className="normal-case lg:hidden"
                        id="leaderId"
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.currentTarget.value)
                          form.setValue("attendees", [])
                        }}
                        aria-invalid={!!errors.leaderId}
                        aria-describedby="leaderIdError"
                      >
                        <option value="">Select a leader</option>
                        {primaryLeaders.data?.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </NativeSelect>
                      <div className="hidden lg:block">
                        <Autocomplete
                          disabled={!isAdmin}
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
                      </div>
                    </>
                  )}
                />
                <FormErrorMessage
                  id="leaderIdError"
                  error={errors.leaderId?.message}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="type">Cell Type</Label>
                <NativeSelect
                  key={form.watch("type")}
                  className="normal-case lg:hidden"
                  id="type"
                  {...form.register("type")}
                  aria-invalid={!!errors.type}
                  aria-describedby="cellTypeError"
                >
                  <option value="">Pick a cell type</option>
                  <option value="SOULWINNING">Soul Winning</option>
                  <option value="OPEN">Open Cell</option>
                  <option value="DISCIPLESHIP">Discipleship Cell</option>
                </NativeSelect>
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
                        className="hidden w-full lg:flex"
                        aria-invalid={!!errors.type}
                        aria-describedby="cellTypeError"
                      >
                        <SelectValue placeholder="Pick a cell type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Cell Type</SelectLabel>
                          <SelectItem value="SOULWINNING">
                            Soul Winning
                          </SelectItem>
                          <SelectItem value="OPEN">Open Cell</SelectItem>
                          <SelectItem value="DISCIPLESHIP">
                            Discipleship Cell
                          </SelectItem>
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
                disabled={!leaderId && isAdmin}
                checked={withAssistant}
                onCheckedChange={(checked) => {
                  setWithAssistant(checked)
                  form.setValue("assistant_id", undefined)
                }}
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
                    <>
                      <NativeSelect
                        key={form.watch("assistant_id")}
                        className="normal-case lg:hidden"
                        id="assistant_id"
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.currentTarget.value)
                        }}
                        aria-invalid={!!errors.assistant_id}
                        aria-describedby="assistantIdError"
                      >
                        <option value="">Select assistant leader</option>
                        {disciplesOfLeader.data?.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </NativeSelect>

                      <div className="hidden lg:block">
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
                      </div>
                    </>
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
              defaultValue="pick-lesson"
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
                  <NativeSelect
                    className="normal-case lg:hidden"
                    value={selectedSeries}
                    onChange={(e) => setSelectedSeries(e.currentTarget.value)}
                  >
                    <option value="">Pick a series</option>
                    {lessonsSeries.data?.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.title}
                      </option>
                    ))}
                  </NativeSelect>
                  <div className="hidden lg:block">
                    <Autocomplete
                      searchText="Search series"
                      placeholderText="Pick a series"
                      value={selectedSeries}
                      onChange={setSelectedSeries}
                      options={maptoOptions(lessonsSeries.data!, "id", "title")}
                    />
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="lessonId">Lesson</Label>
                  <NativeSelect
                    id="lessonId"
                    disabled={!selectedSeries}
                    className="normal-case lg:hidden"
                    {...form.register("lessonId")}
                    aria-invalid={!!errors.lessonId}
                    aria-describedby="lessonIdError"
                  >
                    <option value="">Pick a lesson</option>
                    {lessons.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.title}
                      </option>
                    ))}
                  </NativeSelect>
                  <div className="hidden lg:block">
                    <Controller
                      control={form.control}
                      name="lessonId"
                      render={({ field }) => (
                        <Autocomplete
                          searchText="Search lesson"
                          placeholderText="Pick a lesson"
                          disabled={!selectedSeries}
                          value={field.value}
                          onChange={field.onChange}
                          error={!!errors.lessonId}
                          options={maptoOptions(lessons, "id", "title")}
                        />
                      )}
                    />
                  </div>
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
                        placeholder="Scriptures"
                        hintText="Type a verses (ex. John 3:16), then hit 'Enter'"
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
            <div className="flex flex-col-reverse gap-4 pt-10 md:flex-row md:items-center">
              <Button variant="outline" type="reset" disabled={isSubmitting}>
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

export default CellReportForm
