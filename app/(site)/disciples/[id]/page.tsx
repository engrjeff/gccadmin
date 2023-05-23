import Link from "next/link"
import { format } from "date-fns"
import { ExternalLink, Verified } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
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

  const [disciple, primaryLeaders, userAccounts] = await Promise.all([
    discipleData,
    primaryLeadersData,
    accountsData,
  ])

  return (
    <div className="h-full space-y-6 overflow-y-auto pr-3">
      <div className="flex justify-between">
        <PageTitle
          title={`Disciple Information for ${disciple.name}`}
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
          <p className="flex items-center text-muted-foreground">
            {disciple.name}
            {disciple.isMyPrimary && (
              <span>
                <Verified className="ml-2 h-4 w-4 text-amber-500" />
              </span>
            )}
          </p>
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

        <div className="grid grid-cols-3">
          <p>Records</p>
          <div className="flex items-center gap-3">
            <Link
              href={`/disciples/${disciple.id}/lessons`}
              className={buttonVariants({ variant: "secondary" })}
            >
              Lessons Taken <ExternalLink className="ml-2 h-4 w-5" />
            </Link>
            <Link
              href={`/disciples/${disciple.id}/cell-groups`}
              className={buttonVariants({ variant: "secondary" })}
            >
              Attended Cell Groups <ExternalLink className="ml-2 h-4 w-5" />
            </Link>
          </div>
        </div>
      </div>

      <DetailsForm
        disciple={disciple}
        accountOptions={userAccounts}
        leaderOptions={primaryLeaders}
      />

      <DeleteSection disciple={disciple} />
    </div>
  )
}

export default DiscipleDetailPage
