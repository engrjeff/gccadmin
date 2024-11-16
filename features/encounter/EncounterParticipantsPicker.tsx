import { useState } from "react"
import { Disciple } from "@prisma/client"
import { CheckIcon, Loader2Icon, SearchIcon, XIcon } from "lucide-react"
import { useFormContext } from "react-hook-form"

import { cn } from "@/lib/utils"
import { useDisciples } from "@/hooks/use-disciples"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { CreateEncounterBatchInputs } from "./schema"

export function EncounterParticipantsPicker({
  initialAttendees,
}: {
  initialAttendees?: Disciple[]
}) {
  const encounterBatchForm = useFormContext<CreateEncounterBatchInputs>()

  const attendees = encounterBatchForm.watch("members")

  const [attendeesSearchQuery, setAttendeesSearchQuery] = useState("")

  const disciples = useDisciples()

  const dataSource = initialAttendees
    ? disciples.data?.concat(initialAttendees)
    : disciples.data

  const selectedAttendees = dataSource?.filter((d) => attendees.includes(d.id))

  const unSelectedAttendees = dataSource?.filter(
    (d) =>
      !attendees.includes(d.id) &&
      d.name.toLowerCase().includes(attendeesSearchQuery.toLowerCase())
  )

  const handleAttendeesSelection = (attendeeId: string) => {
    const updatedAttendees = attendees.includes(attendeeId)
      ? attendees.filter((i) => i !== attendeeId)
      : [...attendees, attendeeId]

    encounterBatchForm.setValue("members", updatedAttendees)
  }

  const handleSelectAll = () => {
    encounterBatchForm.setValue(
      "members",
      disciples.data?.map((d) => d.id) ?? []
    )
  }

  const handleDeselectAll = () => {
    encounterBatchForm.setValue("members", [])
  }

  if (disciples?.isLoading)
    return (
      <div className="relative min-h-[300px]">
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Loader2Icon size={32} className="animate-spin" />
          <p>Getting data...</p>
        </div>
      </div>
    )

  return (
    <div className="relative overflow-hidden rounded-md border">
      <div className="sticky top-0 bg-background p-2">
        <div className="relative">
          <Input
            aria-label="Search attendees"
            placeholder="Search here"
            value={attendeesSearchQuery}
            onChange={(e) => setAttendeesSearchQuery(e.currentTarget.value)}
            className="peer h-10 pe-9 ps-9 lg:h-9"
          />
          <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
            <SearchIcon size={16} strokeWidth={2} />
          </div>

          {attendeesSearchQuery ? (
            <button
              type="button"
              className="absolute right-1 top-1/2 inline-flex size-7 -translate-y-1/2 items-center justify-center text-muted-foreground hover:text-foreground"
              onClick={() => setAttendeesSearchQuery("")}
            >
              <XIcon size={16} />
            </button>
          ) : null}
        </div>
      </div>

      {attendees?.length ? (
        <section className="mb-6 border-y">
          <div className="flex items-center justify-between border-b bg-muted/20 px-2.5 py-1">
            <h3 className="text-xs font-medium text-blue-500">
              Selected ({attendees.length})
            </h3>
            <Button
              type="button"
              size="sm"
              variant="link"
              className="text-blue-500 no-underline"
              onClick={handleDeselectAll}
            >
              Deselect All
            </Button>
          </div>
          <ul className="max-h-[300px] w-full divide-y overflow-y-auto">
            {selectedAttendees?.map((d) => (
              <li key={`attendee-${d.id}`}>
                <button
                  title="click to deselect"
                  type="button"
                  onClick={() => handleAttendeesSelection(d.id)}
                  className={cn(
                    "inline-flex w-full items-center gap-3 p-2.5 transition-colors hover:bg-muted",
                    attendees.includes(d.id) ? "bg-muted/30" : ""
                  )}
                >
                  <CheckIcon size={16} className="text-green-500" />
                  <span className="text-sm text-foreground">{d.name}</span>
                  <Badge
                    variant={d.isActive ? "ACTIVE" : "INACTIVE"}
                    className="ml-auto px-1"
                  >
                    {d.isActive ? "Active" : "Inactive"}
                  </Badge>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {attendeesSearchQuery && !unSelectedAttendees?.length ? (
        <div className="flex flex-col items-center justify-center gap-2 pb-6 pt-2">
          <p className="text-center text-sm text-muted-foreground">{`No disciple found for keyword : "${attendeesSearchQuery}"`}</p>
        </div>
      ) : null}

      {unSelectedAttendees?.length ? (
        <section className="border-t">
          <div className="flex items-center justify-between border-b bg-muted/20 px-2.5 py-1">
            <h3 className="text-xs font-medium">Disciples</h3>
            <Button
              type="button"
              size="sm"
              variant="link"
              className="text-blue-500 no-underline"
              onClick={handleSelectAll}
            >
              Select All
            </Button>
          </div>
          <ul className="max-h-[300px] w-full divide-y overflow-y-auto">
            {unSelectedAttendees?.map((d) => (
              <li key={`attendee-${d.id}`}>
                <button
                  title="click to select"
                  type="button"
                  onClick={() => handleAttendeesSelection(d.id)}
                  className={cn(
                    "inline-flex w-full items-center justify-between p-2.5 transition-colors hover:bg-muted",
                    attendees.includes(d.id) ? "bg-muted/30" : ""
                  )}
                >
                  <span className="text-sm text-muted-foreground">
                    {d.name}
                  </span>
                  <Badge
                    variant={d.isActive ? "ACTIVE" : "INACTIVE"}
                    className="px-1"
                  >
                    {d.isActive ? "Active" : "Inactive"}
                  </Badge>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
