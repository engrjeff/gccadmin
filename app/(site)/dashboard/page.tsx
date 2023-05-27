import { Metadata } from "next"
import Link from "next/link"
import { CellStatus, ChurchStatus } from "@prisma/client"
import { Grid, Metric } from "@tremor/react"
import { format } from "date-fns"
import { Activity, Users } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import DateRangePicker from "@/components/ui/data-range-picker"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PageTitle from "@/components/page-title"

import {
  cellStatuses,
  churchStatuses,
  memberTypes,
  processLevels,
} from "../disciples/constants"
import CellStatusData from "./components/cell-status-data"
import ChurchStatusData from "./components/church-status-data"
import DashboardDataFilter from "./components/dashboard-data-filters"
import KPICard from "./components/kpi-card"
import LeadersData from "./components/leaders-data"
import MemberTypeData from "./components/member-type-data"
import ProcessLevelData from "./components/process-level-data"
import WeeklyCellReports from "./components/weekly-cell-reports"
import { getDashboardData } from "./service"

export const metadata: Metadata = {
  title: "Dashboard - Grace City App",
}

async function DashboardPage() {
  const reports = await getDashboardData()

  const leaderOptions = reports.primaryData.map((d) => ({
    value: d.id,
    label: d.name,
  }))

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto pr-3">
      <div className="flex justify-between">
        <PageTitle
          title="Dashboard"
          subtitle="A quick view of church statistics"
        />
      </div>
      <div className="flex">
        <DashboardDataFilter leaderOptions={leaderOptions} />
      </div>
      <div className="grid grid-cols-4 gap-6">
        <KPICard
          title="Active Church Members"
          value={reports.totalKPIData.activeInChurch}
          subValue={`Out of ${reports.totalKPIData.totalDisciples} disciples`}
        />
        <KPICard
          title="Active Cell Members"
          value={reports.totalKPIData.activeInCell}
          subValue={`Out of ${reports.totalKPIData.totalDisciples} disciples`}
        />
        <KPICard
          title="Disciples In Process"
          value={reports.totalKPIData.activeInProcess}
          subValue={`Out of ${reports.totalKPIData.totalDisciples} disciples`}
        />
        <KPICard
          title="Newly Won Souls"
          value={reports.totalKPIData.newlyWonSouls}
          subValue={`As of ${format(new Date(), "MMM dd, yyyy")}`}
        />
      </div>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8">
          <div className="grid grid-cols-2 gap-5">
            <LeadersData leadersDiscipleData={reports.primaryData} />
            <WeeklyCellReports
              totalCGDone={reports.weeklyReports.totalCGsDone}
              cgCountByLeaderData={reports.weeklyReports.cgCountByLeaderData}
            />
          </div>
        </div>
        <div className="col-span-4">
          <Card>
            <Tabs defaultValue="cell">
              <CardHeader className="flex-row p-4 pb-0">
                <TabsList className="align-start">
                  <TabsTrigger value="cell">Cell Group</TabsTrigger>
                  <TabsTrigger value="church">Church</TabsTrigger>
                  <TabsTrigger value="process">Process</TabsTrigger>
                  <TabsTrigger value="members">Members</TabsTrigger>
                </TabsList>
              </CardHeader>
              <TabsContent value="cell">
                <CellStatusData data={reports.cellData} />
              </TabsContent>
              <TabsContent value="church">
                <ChurchStatusData data={reports.churchData} />
              </TabsContent>
              <TabsContent value="process">
                <ProcessLevelData data={reports.processData} />
              </TabsContent>
              <TabsContent value="members">
                <MemberTypeData data={reports.memberTypeData} />
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
