"use client"

import { FormEvent, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

import { cn } from "@/lib/utils"
import { useDisciplesOfLeader } from "@/hooks/use-disciples-by-leader"
import { useLessonsSeries } from "@/hooks/use-lessons-series"
import { usePrimaryLeaders } from "@/hooks/use-primary-leaders"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import Autocomplete from "@/components/autocomplete"

import DiscipleForm from "../../disciples/components/disciple-form"

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

  const [isLoading, setIsLoading] = useState(false)

  const [withAssistant, setWithAssistant] = useState(false)
  const [attendeesDialogShown, setAttendeesDialogShown] = useState(false)
  const [addDiscipleFormShown, setAddDiscipleFormShown] = useState(false)

  const [attendees, setAttendees] = useState<string[]>([])
  const [selectedSeries, setSelectedSeries] = useState<string>()
  const [selectedLesson, setSelectedLesson] = useState<string>()

  const [assistantId, setAssistantId] = useState<string>()

  const [leaderId, setLeaderId] = useState<string>()

  const primaryLeaders = usePrimaryLeaders()
  const lessonsSeries = useLessonsSeries()
  const disciplesOfLeader = useDisciplesOfLeader(leaderId)

  const [attendeesSearchQuery, setAttendeesSearchQuery] = useState("")

  const attendeesFormRef = useRef<HTMLFormElement | null>(null)

  const isAdmin = session.data?.user?.role === "ADMIN"

  const lessons =
    lessonsSeries.data?.find((i) => i.id === selectedSeries)?.lessons ?? []

  const referencesFromLessons =
    lessons
      .find((i) => i.id === selectedLesson)
      ?.scripture_references.join(", ") ?? ""

  const sortedBySelected = disciplesOfLeader.data?.sort((a, b) =>
    attendees.includes(a.id) ? -1 : 1
  )

  const attendeesOptions = attendeesSearchQuery
    ? sortedBySelected?.filter((d) =>
        d.name.toLowerCase().includes(attendeesSearchQuery.toLowerCase())
      )
    : sortedBySelected

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    if (addDiscipleFormShown) return

    e.preventDefault()

    setIsLoading(true)

    const formData = new FormData(e.currentTarget)

    const values = Object.fromEntries(formData.entries())

    const response = await fetch("/api/cell-reports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...values,
        attendees,
        date: new Date(values.date as string),
        scripture_references: values.scripture_references
          ? String(values.scripture_references)
              .split(",")
              .map((s) => s.trim())
          : undefined,
      }),
    })

    setIsLoading(false)

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
    router.refresh()
  }

  const handleAttendeesSelection = (attendeeId: string) => {
    setAttendees((current) =>
      current.includes(attendeeId)
        ? current.filter((i) => i !== attendeeId)
        : [...current, attendeeId]
    )
  }

  return (
    <div className="rounded-lg bg-muted p-6 shadow-lg">
      <form onSubmit={handleSubmit}>
        <fieldset
          disabled={isLoading || addDiscipleFormShown}
          className={cn("space-y-3", {
            "pointer-events-none opacity-80": isLoading || addDiscipleFormShown,
          })}
        >
          <p className="pb-3 text-xs uppercase text-muted-foreground">
            General Details
          </p>
          <div className="grid gap-4 lg:grid-cols-2">
            {isAdmin && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="leaderId">Cell Leader</Label>
                <Autocomplete
                  searchText="Search leader"
                  placeholderText="Choose a cell leader"
                  value={leaderId}
                  onChange={(value) => {
                    setLeaderId(value)
                    setAttendees([])
                  }}
                  options={maptoOptions(
                    primaryLeaders.data ?? [],
                    "id",
                    "name"
                  )}
                />
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Label htmlFor="type">Cell Type</Label>
              <Select name="type">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pick a cell type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Cell Type</SelectLabel>
                    {["SOULWINNING", "OPEN", "DISCIPLESHIP"].map((cellType) => (
                      <SelectItem key={cellType} value={cellType}>
                        {cellType}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="venue">Venue</Label>
            <Input name="venue" placeholder="Venue" />
          </div>

          <div className="flex gap-3">
            <div className="w-full max-w-xs space-y-2 ">
              <Label htmlFor="date">Date</Label>
              <Input
                type="date"
                name="date"
                placeholder="Date"
                pattern="\d{4}-\d{2}-\d{2}"
                max={new Date().toLocaleDateString("en-ca")}
              />
            </div>

            <div className="w-full max-w-xs space-y-2 ">
              <Label htmlFor="time">Time</Label>
              <Input
                type="time"
                name="time"
                placeholder="Time"
                pattern="[0-9]{2}:[0-9]{2}"
              />
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
              <Autocomplete
                searchText="Search disciple"
                placeholderText="Select assistant leader"
                value={assistantId}
                onChange={(value) => {
                  setAssistantId(value)
                  setAttendees((current) => [...current, value])
                }}
                options={maptoOptions(
                  disciplesOfLeader.data ?? [],
                  "id",
                  "name"
                )}
              />
            </div>
          )}

          <p className="inline-block pt-4 text-xs uppercase text-muted-foreground">
            Lesson Details
          </p>

          <Tabs defaultValue="pick-lesson" className="w-full">
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
                  value={selectedSeries}
                  onChange={setSelectedSeries}
                  options={maptoOptions(lessonsSeries.data!, "id", "title")}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="lessonId">Lesson</Label>
                <Autocomplete
                  searchText="Search lesson"
                  placeholderText="Pick a lesson"
                  disabled={!selectedSeries}
                  value={selectedLesson}
                  onChange={setSelectedLesson}
                  options={maptoOptions(lessons, "id", "title")}
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
                <Input name="lesson_name" placeholder="Lesson title" />
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="scripture_references">
                  Scripture References
                </Label>
                <Textarea
                  name="scripture_references"
                  placeholder="Enter a comma-separated list of verses (e.g. John 3:16, Romans 5:8, Luke 15)"
                />
              </div>
            </TabsContent>
          </Tabs>

          <p className="inline-block pt-4 text-xs uppercase text-muted-foreground">
            Attendees
          </p>
          <div className="my-2 space-x-3">
            <input
              type="hidden"
              name="attendees"
              hidden
              defaultValue={attendees}
              key={attendees.length}
            />
            <Dialog
              open={attendeesDialogShown}
              onOpenChange={setAttendeesDialogShown}
            >
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  type="button"
                  disabled={!leaderId && isAdmin}
                >
                  Select Attendees
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Select Cell Group Attendees</DialogTitle>
                  <DialogDescription>
                    Choose the disciples who attended this cell group
                  </DialogDescription>
                </DialogHeader>
                <form ref={attendeesFormRef}>
                  <Input
                    placeholder="Search here"
                    value={attendeesSearchQuery}
                    onChange={(e) =>
                      setAttendeesSearchQuery(e.currentTarget.value)
                    }
                  />
                  <div className="my-3 h-[350px] max-h-[350px] overflow-y-auto py-3 pr-2">
                    {attendeesOptions?.length === 0 ? (
                      <div className="space-y-4 text-center">
                        <p className="text-center text-muted-foreground">
                          No results found
                        </p>
                        <Sheet
                          open={addDiscipleFormShown}
                          onOpenChange={setAddDiscipleFormShown}
                        >
                          <SheetTrigger asChild>
                            <Button type="button">Add Disciple</Button>
                          </SheetTrigger>
                          <SheetContent>
                            <SheetHeader>
                              <SheetTitle>Create Disciple</SheetTitle>
                              <SheetDescription>
                                Complete the form below
                              </SheetDescription>
                            </SheetHeader>
                            <div className="[&>div]:bg-background [&>div]:px-0 [&>div]:shadow-none">
                              <DiscipleForm />
                            </div>
                          </SheetContent>
                        </Sheet>
                      </div>
                    ) : null}
                    {attendeesOptions?.map((disciple) => (
                      <div
                        key={disciple.id}
                        className="rounded px-2 py-3 hover:bg-muted"
                      >
                        <Label
                          htmlFor={disciple.id}
                          className={cn(
                            "flex cursor-pointer items-center gap-2",
                            disciple.id === assistantId
                              ? "pointer-events-none opacity-60"
                              : ""
                          )}
                        >
                          <Checkbox
                            id={disciple.id}
                            name={disciple.id}
                            checked={attendees.includes(disciple.id)}
                            onCheckedChange={() =>
                              handleAttendeesSelection(disciple.id)
                            }
                          />
                          {disciple.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() =>
                        setAttendees(assistantId ? [assistantId] : [])
                      }
                    >
                      Clear Selection
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setAttendeesDialogShown(false)}
                    >
                      Done {attendees.length > 0 ? `(${attendees.length})` : ""}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <span className="text-muted-foreground">
              {attendees.length} selected
            </span>
          </div>
          <div className="flex items-center gap-2 pt-10">
            <Button variant="ghost" type="reset" disabled={isLoading}>
              Reset
            </Button>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </fieldset>
      </form>
    </div>
  )
}

export default CellReportForm
