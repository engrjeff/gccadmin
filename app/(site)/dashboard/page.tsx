import { Metadata } from "next"
import { MemberStatisticsByCellStatus } from "@/features/dashboard/MemberStatisticsByCellStatus"
import { MemberStatisticsByChurchStatus } from "@/features/dashboard/MemberStatisticsByChurchStatus"
import { MemberStatisticsByType } from "@/features/dashboard/MemberStatisticsByType"

import PageTitle from "@/components/page-title"

export const metadata: Metadata = {
  title: "Dashboard",
}

interface PageProps {
  searchParams: { from?: string; to?: string }
}

async function DashboardPage({ searchParams }: PageProps) {
  return (
    <>
      <div className="relative flex flex-col gap-4 overflow-hidden p-6 py-4">
        <div className="flex items-start justify-between gap-4">
          <PageTitle
            title="Dashboard"
            subtitle="Quick insights for GCC statistics."
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          <h2 className="font-semibold mb-2">Member Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-12">
            <MemberStatisticsByType />
            <MemberStatisticsByCellStatus />
            <MemberStatisticsByChurchStatus />
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
