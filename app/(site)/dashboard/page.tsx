import { Metadata } from "next"

import PageTitle from "@/components/page-title"

import KPIStats from "./components/kpi-stats"
import LeadersData from "./components/leaders-data"
import WeeklyCellReports from "./components/weekly-cell-reports"

export const metadata: Metadata = {
  title: "Dashboard",
}

async function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageTitle title="Dashboard" />
      <KPIStats />
      <div className="grid gap-6 xl:grid-cols-2">
        <LeadersData />
        <WeeklyCellReports />
      </div>
    </div>
  )
}

export default DashboardPage
