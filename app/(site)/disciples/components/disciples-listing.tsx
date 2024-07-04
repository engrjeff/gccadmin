import { getDisciples, getPrimaryLeaders } from "../service/disciples"
import DisciplesTable from "./disciples-table"

interface Props {
  active: string
}

async function DisciplesListing({ active }: Props) {
  const { disciples } = await getDisciples({ isActive: active })

  const leaders = await getPrimaryLeaders()
  return <DisciplesTable disciples={disciples} leaders={leaders} />
}

export default DisciplesListing
