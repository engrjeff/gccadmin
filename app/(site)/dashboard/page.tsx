import { Metadata } from "next"

import PageTitle from "@/components/page-title"

import GroupStatusData from "./components/group-status-data"
import KPIStats from "./components/kpi-stats"
import LeadersData from "./components/leaders-data"
import WeeklyCellReports from "./components/weekly-cell-reports"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Dashboard",
}

async function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageTitle title="Dashboard" />
      <KPIStats />
      <div className="grid gap-6 xl:grid-cols-2">
        <WeeklyCellReports />
        <LeadersData />
      </div>
      <GroupStatusData />
    </div>
  )
}

export default DashboardPage
