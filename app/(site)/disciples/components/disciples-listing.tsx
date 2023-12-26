import { getDisciples, getPrimaryLeaders } from "../service/disciples"
import DisciplesTable from "./disciples-table"

interface Props {
  active: string
}

async function DisciplesListing({ active }: Props) {
  const { disciples } = await getDisciples({ isActive: active })
  const leaders = await getPrimaryLeaders()
  return (
    <div className="rounded-lg border dark:bg-muted">
      <DisciplesTable disciples={disciples} leaders={leaders} />
    </div>
  )
}

export default DisciplesListing
