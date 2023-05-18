import { Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import PageTitle from "@/components/page-title"

import { columns } from "./components/columns"
import CurrentDiscipleProvider from "./components/current-disciple-provider"
import DiscipleEditForm from "./components/disciple-edit-form"
import { DisciplesTable } from "./components/disciples-table"
import MemberForm from "./components/member-form"
import { getDisciples } from "./service/disciples"

async function MembersPage() {
  const { disciples, user } = await getDisciples()

  if (!user.discipleId)
    return (
      <div className="p-6">
        <p className="text-muted-foreground">
          Your account has not been validated by the Admin. Kindly wait before
          you can access this page {JSON.stringify(user, null, 2)}
        </p>
      </div>
    )

  const leaders = disciples.filter((d) => d.isPrimary)

  const title = user.role === "ADMIN" ? "GCC Members" : "Your Disciples"
  const subtitle =
    user.role === "ADMIN"
      ? "Here's a list of GCC members"
      : "List of your disciples"

  return (
    <CurrentDiscipleProvider>
      <div className="flex items-center justify-between px-6">
        <PageTitle title={title} subtitle={subtitle} />
        <div className="space-x-3">
          <Button size="sm" variant="outline">
            <Download className="mr-2 h-4 w-5" /> Import
          </Button>
          <MemberForm leaderOptions={leaders} />
          <DiscipleEditForm leaderOptions={leaders} />
        </div>
      </div>
      <div className="h-[calc(100%-64px)] max-h-[calc(100%-64px)] overflow-auto px-6">
        <DisciplesTable columns={columns} data={disciples} />
      </div>
    </CurrentDiscipleProvider>
  )
}

export default MembersPage
