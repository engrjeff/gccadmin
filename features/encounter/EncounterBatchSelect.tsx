import { EncounterBatchSelectClient } from "./EncounterBatchSelect.client"
import { getEncounterBatchList } from "./queries"

export async function EncounterBatchSelect() {
  const batches = await getEncounterBatchList()

  return <EncounterBatchSelectClient batches={batches} />
}
