import { Metadata } from "next"
import { MemberStatisticsByCellStatus } from "@/features/dashboard/MemberStatisticsByCellStatus"
import { MemberStatisticsByChurchStatus } from "@/features/dashboard/MemberStatisticsByChurchStatus"
import { MemberStatisticsByType } from "@/features/dashboard/MemberStatisticsByType"
import { WeeklyCellReports } from "@/features/dashboard/WeeklyCellReports"

import PageTitle from "@/components/page-title"

export const metadata: Metadata = {
  title: "Dashboard",
}

async function DashboardPage() {
  return (
    <>
      <div className="relative flex flex-col gap-4 overflow-hidden py-4">
        <div className="flex items-start justify-between gap-4 px-4">
          <PageTitle
            title="Dashboard"
            subtitle="Quick insights for GCC statistics."
          />
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-4">
          <div>
            <h2 className="mb-2 font-semibold text-indigo-500">
              Weekly Cell Groups
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-12 xl:grid-cols-3">
              <WeeklyCellReports />
            </div>
          </div>
          <div>
            <h2 className="mb-2 font-semibold text-indigo-500">
              Member Statistics
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-12 xl:grid-cols-3">
              <MemberStatisticsByType />
              <MemberStatisticsByCellStatus />
              <MemberStatisticsByChurchStatus />
            </div>
          </div>
        </div>
      </div>

      {/* <div className="flex-1 space-y-6 overflow-auto px-4 lg:px-6">
        <KPIStats />
        <WeeklyCellReports searchParams={searchParams} />
        <GroupStatusData />
        <AnnualCellReports />
        <LeadersData />
      </div> */}
    </>
  )
}

export default DashboardPage
