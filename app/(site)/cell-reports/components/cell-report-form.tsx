"use client"

import { FormEvent, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Disciple, Lesson, LessonSeries } from "@prisma/client"
import { Plus } from "lucide-react"
import { useSession } from "next-auth/react"

import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

type SeriesWithLessons = LessonSeries & { lessons: Lesson[] }

interface CellReportFormProps {
  lessonOptions: SeriesWithLessons[]
  discipleOptions: Disciple[]
  primaryLeaders: Disciple[]
}

const ReporFormComponent = ({
  lessonOptions,
  discipleOptions,
  primaryLeaders,
  onDone,
}: CellReportFormProps & { onDone: () => void }) => {
  const router = useRouter()
  const session = useSession()

  const [isLoading, setIsLoading] = useState(false)

  const [withAssistant, setWithAssistant] = useState(false)
  const [attendeesDialogShown, setAttendeesDialogShown] = useState(false)
  const [attendees, setAttendees] = useState<string[]>([])
  const [selectedSeries, setSelectedSeries] = useState<string>()
  const [selectedLesson, setSelectedLesson] = useState<string>()

  const [assistantId, setAssistantId] = useState<string>()

  const [leaderId, setLeaderId] = useState<string>()

  const [attendeesSearchQuery, setAttendeesSearchQuery] = useState("")

  const attendeesFormRef = useRef<HTMLFormElement | null>(null)

  const isAdmin = session.data?.user?.role === "ADMIN"

  const lessons =
    lessonOptions.find((i) => i.id === selectedSeries)?.lessons ?? []

  const referencesFromLessons =
    lessons
      .find((i) => i.id === selectedLesson)
      ?.scripture_references.join(", ") ?? ""

  // only the disciples who belong to the selected leader (if user is admin) or user.disciple_id
  const discArr = isAdmin
    ? discipleOptions.filter((d) => d.leaderId === leaderId)
    : discipleOptions

  const attendeesOptions = attendeesSearchQuery
    ? discArr.filter((d) =>
        d.name.toLowerCase().includes(attendeesSearchQuery.toLowerCase())
      )
    : discArr

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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

    onDone()
  }

  const handleAttendeesSelection = (attendeeId: string) => {
    setAttendees((current) =>
      current.includes(attendeeId)
        ? current.filter((i) => i !== attendeeId)
        : [...current, attendeeId]
    )
  }

  return (
    <form
      key={String(open)}
      name="cell-report-form"
      id="cell-report-form"
      className={cn("space-y-3 py-4", {
        "pointer-events-none opacity-80": isLoading,
      })}
      onSubmit={handleSubmit}
    >
      <p className="text-xs uppercase text-muted-foreground">General Details</p>
      {isAdmin && (
        <div className="flex flex-col space-y-2">
          <Label htmlFor="leaderId">Cell Leader</Label>
          <Select
            name="leaderId"
            value={leaderId}
            onValueChange={(value) => {
              setLeaderId(value)
              setAttendees([])
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a cell leader" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Cell Leader</SelectLabel>
                {primaryLeaders.map((leader) => (
                  <SelectItem key={leader.id} value={leader.id}>
                    {leader.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="flex flex-col space-y-2">
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
      <div className="space-y-2">
        <Label htmlFor="venue">Venue</Label>
        <Input name="venue" placeholder="Venue" />
      </div>

      <div className="flex gap-3">
        <div className="w-full space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            type="date"
            name="date"
            placeholder="Date"
            max={new Date().toLocaleDateString("en-ca")}
          />
        </div>

        <div className="w-full space-y-2">
          <Label htmlFor="time">Time</Label>
          <Input type="time" name="time" placeholder="Time" />
        </div>
      </div>

      <div className="flex items-center space-x-2 pt-4">
        <Switch
          checked={withAssistant}
          onCheckedChange={(checked) => setWithAssistant(checked)}
        />
        <Label>I have an assistant leader</Label>
      </div>

      {withAssistant && (
        <div className="flex flex-col space-y-2">
          <Label htmlFor="assistant_id">Assistant Leader</Label>
          <Select
            name="assistant_id"
            value={assistantId}
            onValueChange={(value) => {
              setAssistantId(value)

              setAttendees((current) => [...current, value])
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose assistant leader" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] overflow-y-auto">
              <SelectGroup>
                <SelectLabel>Assistant Leader</SelectLabel>
                {discArr.map((disciple) => (
                  <SelectItem key={disciple.id} value={disciple.id}>
                    {disciple.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
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
            <Select value={selectedSeries} onValueChange={setSelectedSeries}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pick a series" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Series</SelectLabel>
                  {lessonOptions.map((series) => (
                    <SelectItem key={series.id} value={series.id}>
                      {series.title}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="lessonId">Lesson</Label>
            <Select
              name="lessonId"
              disabled={!selectedSeries}
              value={selectedLesson}
              onValueChange={setSelectedLesson}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pick a Lesson" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Lesson</SelectLabel>
                  {lessons.map((lesson) => (
                    <SelectItem key={lesson.id} value={lesson.id}>
                      {lesson.title}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
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
            <Label htmlFor="scripture_references">Scripture References</Label>
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
        <AlertDialog
          open={attendeesDialogShown}
          onOpenChange={setAttendeesDialogShown}
        >
          <AlertDialogTrigger asChild>
            <Button
              variant="secondary"
              type="button"
              disabled={!leaderId && isAdmin}
            >
              Select Attendees
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Select Cell Group Attendees</AlertDialogTitle>
              <AlertDialogDescription>
                Choose the disciples who attended this cell group
              </AlertDialogDescription>
            </AlertDialogHeader>
            <form ref={attendeesFormRef}>
              <Input
                placeholder="Search here"
                value={attendeesSearchQuery}
                onChange={(e) => setAttendeesSearchQuery(e.currentTarget.value)}
              />
              <div className="my-3 h-[350px] max-h-[350px] overflow-y-auto py-3 pr-2">
                {attendeesOptions.length === 0 ? (
                  <p className="text-center text-muted-foreground">
                    No results found
                  </p>
                ) : null}
                {attendeesOptions.map((disciple) => (
                  <div
                    key={disciple.id}
                    className="rounded px-2 py-3 hover:bg-muted"
                  >
                    <Label
                      htmlFor={disciple.id}
                      className="flex cursor-pointer items-center gap-2 "
                    >
                      <Checkbox
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
              <AlertDialogFooter>
                <AlertDialogCancel type="button">Close</AlertDialogCancel>
                <AlertDialogAction type="button">Done</AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
        <span className="text-muted-foreground">
          {attendees.length} selected
        </span>
      </div>
      <SheetFooter className="flex items-center gap-2 pt-10">
        <Button variant="ghost" type="reset" disabled={isLoading}>
          Reset
        </Button>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </SheetFooter>
    </form>
  )
}

function CellReportForm(props: CellReportFormProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-5" /> Create Cell Report
        </Button>
      </SheetTrigger>
      <SheetContent
        position="right"
        size="sm"
        className="w-1/3 overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>Create a Cell Report</SheetTitle>
          <SheetDescription>
            Create a cell report here. Click save when you are done.
          </SheetDescription>
        </SheetHeader>
        <ReporFormComponent {...props} onDone={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}

export default CellReportForm
