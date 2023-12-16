import { useState } from "react"
import { useFormContext } from "react-hook-form"

import { cn } from "@/lib/utils"
import { useDisciplesOfLeader } from "@/hooks/use-disciples-by-leader"
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
}

function AttendeesPicker({ disabled }: AttendeesPickerProps) {
  const [attendeesDialogShown, setAttendeesDialogShown] = useState(false)
  const [addDiscipleFormShown, setAddDiscipleFormShown] = useState(false)
  const [attendeesSearchQuery, setAttendeesSearchQuery] = useState("")

  const cellReportForm = useFormContext<CreateCellReportInputs>()

  const leaderId = cellReportForm.watch("leaderId")
  const assistantId = cellReportForm.watch("assistant_id")
  const attendees = cellReportForm.watch("attendees")

  const disciplesOfLeader = useDisciplesOfLeader(leaderId)

  const sortedBySelected = disciplesOfLeader.data
    ?.sort((a, b) => (a.name < b.name ? -1 : 1))
    .sort((c, d) => (attendees.includes(c.id) ? -1 : 1))

  const attendeesOptions = attendeesSearchQuery
    ? sortedBySelected?.filter((d) =>
        d.name.toLowerCase().includes(attendeesSearchQuery.toLowerCase())
      )
    : sortedBySelected

  const handleAttendeesSelection = (attendeeId: string) => {
    cellReportForm.setValue(
      "attendees",
      attendees.includes(attendeeId)
        ? attendees.filter((i) => i !== attendeeId)
        : [...attendees, attendeeId]
    )
  }

  return (
    <Dialog
      open={attendeesDialogShown}
      onOpenChange={(state) => {
        setAttendeesDialogShown(state)
        setAddDiscipleFormShown(false)
        setAttendeesSearchQuery("")
      }}
    >
      <DialogTrigger asChild>
        <Button variant="secondary" type="button" disabled={disabled}>
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
        <div>
          <Input
            placeholder="Search here"
            value={attendeesSearchQuery}
            onChange={(e) => setAttendeesSearchQuery(e.currentTarget.value)}
          />
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
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Create Disciple</SheetTitle>
                      <SheetDescription>
                        Complete the form below
                      </SheetDescription>
                    </SheetHeader>
                    <div className="[&>div]:bg-background [&>div]:px-0 [&>div]:shadow-none">
                      <DiscipleForm leaderId={leaderId} modalMode />
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
                    disabled={disciple.id === assistantId}
                    checked={
                      attendees.includes(disciple.id) ||
                      disciple.id === assistantId
                    }
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
                cellReportForm.setValue(
                  "attendees",
                  assistantId ? [assistantId] : []
                )
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
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AttendeesPicker
