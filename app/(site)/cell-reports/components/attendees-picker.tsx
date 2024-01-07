import { useState } from "react"
import { XIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import { useFormContext } from "react-hook-form"

import { cn } from "@/lib/utils"
import { useDisciplesOfLeader } from "@/hooks/use-disciples-by-leader"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { CreateCellReportInputs } from "@/app/api/cell-reports/schema"

import DiscipleForm from "../../disciples/components/disciple-form"

interface AttendeesPickerProps {
  disabled?: boolean
  attendees: string[]
  onAttendeesValueChange: (val: string[]) => void
}

function AttendeesPicker(props: AttendeesPickerProps) {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const { disabled, attendees, onAttendeesValueChange } = props

  if (isDesktop)
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="secondary" type="button" disabled={disabled}>
            Select Attendees
          </Button>
        </DialogTrigger>
        <span className="text-muted-foreground">
          {attendees.length} selected
        </span>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Cell Group Attendees</DialogTitle>
            <DialogDescription>
              Choose the disciples who attended this cell group
            </DialogDescription>
          </DialogHeader>
          <AttendeesPickerControl
            attendees={attendees}
            onAttendeesValueChange={onAttendeesValueChange}
            onDone={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    )

  return (
    <Drawer open={open} onOpenChange={setOpen} shouldScaleBackground={false}>
      <DrawerTrigger asChild>
        <Button variant="secondary" type="button" disabled={disabled}>
          Select Attendees
        </Button>
      </DrawerTrigger>
      <span className="text-muted-foreground">{attendees.length} selected</span>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Select Cell Group Attendees</DrawerTitle>
          <DrawerDescription>
            Choose the disciples who attended this cell group
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4">
          <AttendeesPickerControl
            attendees={attendees}
            onAttendeesValueChange={onAttendeesValueChange}
            onDone={() => setOpen(false)}
          />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default AttendeesPicker

interface AttendeesPickerControl {
  attendees: string[]
  onAttendeesValueChange: (val: string[]) => void
  onDone: () => void
}

function AttendeesPickerControl({
  attendees,
  onAttendeesValueChange,
  onDone,
}: AttendeesPickerControl) {
  const [addDiscipleFormShown, setAddDiscipleFormShown] = useState(false)
  const [attendeesSearchQuery, setAttendeesSearchQuery] = useState("")

  const isDesktop = useMediaQuery("(min-width: 768px)")

  const cellReportForm = useFormContext<CreateCellReportInputs>()

  const session = useSession()

  const isAdmin = session.data?.user?.role === "ADMIN"

  const leaderId = cellReportForm.watch("leaderId")
  const assistantId = cellReportForm.watch("assistant_id")

  const disciplesOfLeader = useDisciplesOfLeader(
    isAdmin ? leaderId : session.data?.user.discipleId
  )

  const sortedBySelected = disciplesOfLeader.data
    ?.sort((a, b) => (a.name < b.name ? -1 : 1))
    .sort((c, d) => (attendees.includes(c.id) ? -1 : 1))

  const attendeesOptions = attendeesSearchQuery
    ? sortedBySelected?.filter((d) =>
        d.name.toLowerCase().includes(attendeesSearchQuery.toLowerCase())
      )
    : sortedBySelected

  const handleAttendeesSelection = (attendeeId: string) => {
    const updatedAttendees = attendees.includes(attendeeId)
      ? attendees.filter((i) => i !== attendeeId)
      : [...attendees, attendeeId]

    onAttendeesValueChange(updatedAttendees)
  }

  return (
    <div>
      <div className="relative flex-1">
        <Input
          placeholder="Search here"
          value={attendeesSearchQuery}
          onChange={(e) => setAttendeesSearchQuery(e.currentTarget.value)}
        />
        {attendeesSearchQuery.length > 0 ? (
          <Button
            onClick={() => setAttendeesSearchQuery("")}
            type="button"
            size="icon"
            variant="ghost"
            className="absolute right-1 top-1"
          >
            <span className="sr-only">clear</span>
            <XIcon className="h-4 w-4" />
          </Button>
        ) : null}
      </div>

      <div className="my-3 h-[350px] max-h-[350px] overflow-y-auto py-3 pr-2">
        {attendeesOptions?.length === 0 ? (
          <div className="space-y-4 text-center">
            <p className="text-center text-muted-foreground">
              No results found
            </p>
            <Sheet
              open={addDiscipleFormShown}
              onOpenChange={(state) => {
                setAddDiscipleFormShown(state)

                if (!state) {
                  disciplesOfLeader.refetch()
                }
              }}
            >
              <SheetTrigger asChild>
                <Button type="button">Add Disciple</Button>
              </SheetTrigger>
              <SheetContent
                position="right"
                size="sm"
                className="w-full overflow-y-auto lg:w-1/3"
              >
                <SheetHeader>
                  <SheetTitle>Create Disciple</SheetTitle>
                  <SheetDescription>Complete the form below</SheetDescription>
                </SheetHeader>
                <div className="[&>div]:border-none [&>div]:bg-background [&>div]:px-0 [&>div]:shadow-none">
                  <DiscipleForm leaderId={leaderId} modalMode />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        ) : null}
        <input
          type="hidden"
          name="attendees"
          hidden
          defaultValue={attendees}
          key={attendees.length}
        />
        {attendeesOptions?.map((disciple) => (
          <div key={disciple.id} className="rounded px-2 py-3 hover:bg-muted">
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
                disabled={disciple.id === assistantId}
                checked={
                  attendees.includes(disciple.id) || disciple.id === assistantId
                }
                onCheckedChange={() => handleAttendeesSelection(disciple.id)}
              />
              {disciple.name}
            </Label>
          </div>
        ))}
      </div>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="ghost"
          onClick={() =>
            cellReportForm.setValue(
              "attendees",
              assistantId ? [assistantId] : []
            )
          }
        >
          Clear Selection
        </Button>
        <Button type="button" onClick={onDone}>
          Done {attendees.length > 0 ? `(${attendees.length})` : ""}
        </Button>
      </div>
    </div>
  )
}
