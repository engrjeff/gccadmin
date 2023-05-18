import Link from "next/link"
import { format } from "date-fns"

import { getCurrentUser } from "@/lib/session"
import PageTitle from "@/components/page-title"

import DeleteSection from "../components/delete-section"
import DetailsForm from "../components/details-form"
import {
  getDiscipleById,
  getPrimaryLeaders,
  getUserAccounts,
} from "../service/disciples"

async function DiscipleDetailPage({ params }: { params: { id: string } }) {
  const discipleData = getDiscipleById(params.id)
  const primaryLeadersData = getPrimaryLeaders()
  const accountsData = getUserAccounts()
  const userData = getCurrentUser()

  const [disciple, primaryLeaders, userAccounts, user] = await Promise.all([
    discipleData,
    primaryLeadersData,
    accountsData,
    userData,
  ])

  if (!disciple) return <p>Not found...</p>

  return (
    <div className="h-full space-y-6 overflow-y-auto px-6">
      <div className="flex items-center justify-between">
        <PageTitle
          title="Disciple Information"
          subtitle="Personal and Church-related information"
        />
        <Link href="/disciples" className="underline hover:text-primary">
          Back to List
        </Link>
      </div>

      <div className="space-y-4 rounded-lg border p-4">
        <p className="text-sm font-semibold uppercase text-muted-foreground">
          Personal
        </p>
        <div className="grid grid-cols-3">
          <p>Name</p>
          <p className="text-muted-foreground">{disciple.name}</p>
        </div>
        <div className="grid grid-cols-3">
          <p>Gender</p>
          <p className="capitalize text-muted-foreground">
            {disciple.gender.toLowerCase()}
          </p>
        </div>
        <div className="grid grid-cols-3">
          <p>Birthdate</p>
          <p className="text-muted-foreground">
            {format(disciple.birthdate, "MMMM dd, yyyy")}
          </p>
        </div>
        <div className="grid grid-cols-3">
          <p>Address</p>
          <p className="text-muted-foreground">{disciple.address}</p>
        </div>
      </div>

      <div className="space-y-4 rounded-lg border p-4">
        <p className="text-sm font-semibold uppercase text-muted-foreground">
          Church-related
        </p>
        <div className="grid grid-cols-3">
          <p>Member Type</p>
          <p className="capitalize text-muted-foreground">
            {disciple.member_type.toLowerCase()}
          </p>
        </div>
        <div className="grid grid-cols-3">
          <p>Process Level</p>
          <p className="capitalize text-muted-foreground">
            {disciple.process_level.toLowerCase()}
          </p>
        </div>
        <div className="grid grid-cols-3">
          <p>Leader</p>
          <p className="capitalize text-muted-foreground">
            {disciple.leader?.name}
          </p>
        </div>
      </div>

      {user?.role === "ADMIN" && (
        <DetailsForm
          disciple={disciple}
          accountOptions={userAccounts}
          leaderOptions={primaryLeaders}
        />
      )}

      <DeleteSection />
    </div>
  )
}

export default DiscipleDetailPage
