import { getStatusData } from "../service"
import CellStatusData from "./cell-status-data"
import ChurchStatusData from "./church-status-data"
import MemberTypeData from "./member-type-data"
import ProcessLevelData from "./process-level-data"

async function GroupStatusData() {
  const data = await getStatusData()

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <ChurchStatusData data={data.churchData} />
      <CellStatusData data={data.cellData} />
      <MemberTypeData data={data.memberTypeData} />
      <ProcessLevelData data={data.processData} />
    </div>
  )
}

export default GroupStatusData
