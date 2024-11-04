import { getDisciples } from "../service/disciples"
import DisciplesTable from "./disciples-table"

interface Props {
  active: string
}

async function DisciplesListing({ active }: Props) {
  const { disciples } = await getDisciples({ isActive: active })

  return <DisciplesTable disciples={disciples} />
}

export default DisciplesListing
