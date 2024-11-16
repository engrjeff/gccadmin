import { format } from "date-fns"

import { removeUnderscores } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { EncounterBatchEditModal } from "./EncounterBatchEditModal"
import { getEncounterBatch, GetEncounterBatchArgs } from "./queries"

export async function EncounterBatchListing(props: GetEncounterBatchArgs) {
  const encounterBatch = await getEncounterBatch(props)

  if (!encounterBatch)
    return (
      <div className="flex min-h-[400px] flex-1 flex-col items-center justify-center gap-2 rounded-lg border border-dashed">
        <h2>No records listed yet.</h2>
        <p className="text-sm text-muted-foreground">
          Start by creating a record now.
        </p>
      </div>
    )

  return (
    <>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h2 className="block text-sm font-semibold">
            {encounterBatch.batchName}{" "}
          </h2>
          <EncounterBatchEditModal batch={encounterBatch} />
        </div>
        <p className="text-xs text-muted-foreground">
          Date: <span>{format(encounterBatch.startDate, "MMM dd, yyyy")}</span>{" "}
          - <span>{format(encounterBatch.endDate, "MMM dd, yyyy")}</span>
        </p>
      </div>
      <Table className="relative w-full overflow-auto rounded-lg border lg:rounded-none lg:border-none">
        <TableCaption>
          {!encounterBatch.members.length &&
          props.memberStatus === "inactive" ? (
            <div className="my-6 text-center">
              Yey! Looks like every participant of Encounter Batch:{" "}
              <span className="font-semibold text-foreground">
                {encounterBatch.batchName}
              </span>{" "}
              is still active.
            </div>
          ) : (
            <>
              Participants of Encounter Batch: {encounterBatch.batchName} who
              are {props.memberStatus === "inactive" ? "inactive" : "active"}.
            </>
          )}
        </TableCaption>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Name</TableHead>
            <TableHead>Network Leader</TableHead>
            <TableHead>Handled By</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Process Level</TableHead>
            <TableHead>Process Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {encounterBatch.members.map((member) => (
            <TableRow
              key={`encounter-attendee-${member.id}`}
              className="py-0  hover:bg-background"
            >
              <TableCell className="whitespace-nowrap px-3 py-1 lg:py-2">
                <div>
                  <p>{member.name} </p>
                  <p className="text-xs text-muted-foreground">
                    <span className="capitalize">
                      {member.gender.toLowerCase()}
                    </span>
                    ,{" "}
                    <span className="capitalize">
                      {" "}
                      {member.member_type.toLowerCase()}
                    </span>
                  </p>
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap px-3 py-1 lg:py-2">
                {member.leader?.name}
              </TableCell>
              <TableCell className="whitespace-nowrap px-3 py-1 lg:py-2">
                {member.handled_by?.name ?? (
                  <span className="text-center">--</span>
                )}
              </TableCell>
              <TableCell className="whitespace-nowrap px-3 py-1 lg:py-2">
                <Badge variant={member.isActive ? "ACTIVE" : "INACTIVE"}>
                  {member.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="whitespace-nowrap px-3 py-1 lg:py-2">
                <Badge variant={member.process_level}>
                  {removeUnderscores(member.process_level)}
                </Badge>
              </TableCell>
              <TableCell className="whitespace-nowrap px-3 py-1 lg:py-2">
                <Badge variant={member.process_level_status}>
                  {removeUnderscores(member.process_level_status)}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
