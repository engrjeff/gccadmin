import { Metadata } from "next"

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
          <div>
            <h2 className="mb-1 text-lg font-bold tracking-tight">Dashboard</h2>
            <p className="hidden text-sm text-muted-foreground lg:block">
              Quick insights for GCC statistics.
            </p>
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
