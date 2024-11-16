"use client"

import { EncounterBatch } from "@prisma/client"
import { useQueryState } from "nuqs"

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function EncounterBatchSelectClient({
  batches,
}: {
  batches: EncounterBatch[]
}) {
  const [batchIdQuery, setBatchIdQuery] = useQueryState("batchId", {
    shallow: false,
    defaultValue: batches?.at(0)?.id!,
  })

  if (!batches || !batches.length) return null

  return (
    <>
      <div className="ml-auto w-full min-w-[160px] sm:ml-auto sm:w-auto">
        <Label htmlFor="encounter-batch" className="sr-only">
          Encounter Batch
        </Label>
        <Select value={batchIdQuery} onValueChange={setBatchIdQuery}>
          <SelectTrigger
            id="encounter-batch"
            className="h-9 gap-3 ps-2 text-left"
          >
            <SelectValue placeholder="Select a batch" />
          </SelectTrigger>
          <SelectContent>
            {batches.map((batch) => (
              <SelectItem key={`encounter-batch-${batch.id}`} value={batch.id}>
                {batch.batchName}
                {/* <span className="flex flex-col gap-2">
                  <span className="block text-xs font-semibold">
                    {batch.batchName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    <span>{format(batch.startDate, "MMM dd, yyyy")}</span> -{" "}
                    <span>{format(batch.endDate, "MMM dd, yyyy")}</span>
                  </span>
                </span> */}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  )
}
