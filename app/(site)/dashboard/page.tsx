import { Metadata } from "next"

import PageTitle from "@/components/page-title"

import GroupStatusData from "./components/group-status-data"
import KPIStats from "./components/kpi-stats"
import LeadersData from "./components/leaders-data"
import RefreshDataButton from "./components/refresh-data-button"
import WeeklyCellReports from "./components/weekly-cell-reports"

export const metadata: Metadata = {
  title: "Dashboard",
}

interface PageProps {
  searchParams: { from?: string; to?: string }
}

async function DashboardPage({ searchParams }: PageProps) {
  return (
    <>
      <div className="mb-6 flex items-center justify-between px-4 lg:px-6">
        <PageTitle title="Dashboard" />
        <RefreshDataButton />
      </div>
      <div className="flex-1 space-y-6 overflow-auto px-4 lg:px-6">
        <KPIStats />
        <WeeklyCellReports searchParams={searchParams} />
        <GroupStatusData />
        <LeadersData />
      </div>
    </>
  )
}

export default DashboardPage
