import { getDisciples } from "../service/disciples"
import DisciplesTable from "./disciples-table"

async function DisciplesListing() {
  const { disciples } = await getDisciples({ isActive: "true" })
  return (
    <div className="rounded-lg border dark:bg-muted">
      <DisciplesTable disciples={disciples} />
    </div>
  )
}

export default DisciplesListing
