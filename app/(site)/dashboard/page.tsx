import { Metadata } from "next"

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
      <div className="relative flex flex-col gap-4 overflow-hidden p-4">
        <div className="flex items-start justify-between gap-4">
          <PageTitle
            title="Dashboard"
            subtitle="Quick insights for GCC statistics."
          />
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
