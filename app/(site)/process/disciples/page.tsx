import DisciplesTable from "../../disciples/components/disciples-table"
import {
  getDisciples,
  getPrimaryLeaders,
} from "../../disciples/service/disciples"

async function DisciplesInProcessPage() {
  const { disciples } = await getDisciples({
    isActive: "true",
    inProcess: true,
  })

  const leaders = await getPrimaryLeaders()

  return (
    <div className="flex-1 overflow-auto px-4 lg:px-6">
      <DisciplesTable disciples={disciples} leaders={leaders} />
    </div>
  )
}

export default DisciplesInProcessPage
