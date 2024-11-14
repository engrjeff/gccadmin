import { DisciplesTable } from "./DisciplesTable"
import { getDisciples } from "./queries"
import { DisciplesQueryArgs } from "./schema"

export async function DiscipleListing({
  searchParams,
}: {
  searchParams: DisciplesQueryArgs
}) {
  const { disciples, pageInfo } = await getDisciples(searchParams)

  return (
    <>
      <DisciplesTable
        key={JSON.stringify(searchParams)}
        disciples={disciples}
        pageInfo={pageInfo}
      />
    </>
  )
}
