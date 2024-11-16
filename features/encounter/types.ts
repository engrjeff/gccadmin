import { Disciple, EncounterBatch } from "@prisma/client"

export interface EncounterBatchRecord extends EncounterBatch {
  members: Disciple[]
}
