import { Metadata } from "next"
import { CellgroupsWithAssistants } from "@/features/dashboard/CellgroupsWithAssistants"
import { DisciplesWithCellgroups } from "@/features/dashboard/DisciplesWithCellgroups"
import { MemberStatisticsByCellStatus } from "@/features/dashboard/MemberStatisticsByCellStatus"
import { MemberStatisticsByChurchStatus } from "@/features/dashboard/MemberStatisticsByChurchStatus"
import { MemberStatisticsByType } from "@/features/dashboard/MemberStatisticsByType"
import { ThisMonthDisplay } from "@/features/dashboard/ThisWeekDisplay"
import { WeeklyCellReports } from "@/features/dashboard/WeeklyCellReports"
import { WeeklyCellReportsByLeader } from "@/features/dashboard/WeeklyCellReportsByLeader"
import { format } from "date-fns"

import PageTitle from "@/components/page-title"

import { ViewTabs } from "../components/view-tabs"

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
          <ViewTabs />
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-4">
          <div>
            <h2 className="font-semibold">
              {format(new Date(), "MMMM yyyy")} Cell Groups
            </h2>
            <ThisMonthDisplay />
          </div>
          <div className="grid grid-cols-1 gap-6 lg:gap-6 xl:grid-cols-3">
            <WeeklyCellReports view="monthly" />
            <CellgroupsWithAssistants />
            <DisciplesWithCellgroups />
          </div>
          <div className="py-4">
            <WeeklyCellReportsByLeader />
          </div>
          <div className="space-y-4">
            <div>
              <h2 className="font-semibold">Member Statistics</h2>
              <p className="text-xs text-muted-foreground">As of today</p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-12 xl:grid-cols-3">
              <MemberStatisticsByType />
              <MemberStatisticsByCellStatus />
              <MemberStatisticsByChurchStatus />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DashboardPage
