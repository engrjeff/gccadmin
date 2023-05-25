import { Metadata } from "next"
import Link from "next/link"
import { CellStatus, ChurchStatus } from "@prisma/client"
import { Activity } from "lucide-react"

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PageTitle from "@/components/page-title"

import LeadersData from "./components/leaders-data"
import { getDashboardData } from "./service"

const getChurchStatusText = (churchStatus: ChurchStatus) => {
  switch (churchStatus) {
    case "ACS":
      return "Attended Church"
    case "NACS":
      return "Not Yet Attended Church"
    case "REGULAR":
      return "Regular Attendees"
  }
}

const getStatusText = (inputStr: string) => {
  return inputStr.split("_").join(" ").toLowerCase()
}

export const metadata: Metadata = {
  title: "Dashboard - Grace City App",
}

async function DashboardPage() {
  const { churchData, cellData, processData, primaryData, weeklyReports } =
    await getDashboardData()

  return (
    <div className="flex h-full flex-col gap-7 overflow-y-auto pr-3">
      <div>
        <PageTitle
          title="Dashboard"
          subtitle="A quick view of church statistics"
        />
      </div>
      <div className="grid grid-cols-7 gap-6">
        <div className="col-span-5 space-y-6">
          <Tabs defaultValue="church">
            <TabsList className="mb-5">
              <TabsTrigger value="church">Church</TabsTrigger>
              <TabsTrigger value="cell-group">Cell Group</TabsTrigger>
              <TabsTrigger value="process-level">Process</TabsTrigger>
            </TabsList>
            <TabsContent value="church">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {churchData.map((data) => (
                  <Card key={data.church_status}>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-sm font-medium tracking-tight">
                        {getChurchStatusText(data.church_status)}
                      </CardTitle>
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{data._count}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="cell-group">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {cellData.map((data) => (
                  <Card key={data.cell_status}>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-sm font-medium capitalize tracking-tight">
                        {getStatusText(data.cell_status)}
                      </CardTitle>
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{data._count}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="process-level">
              <div className="grid auto-cols-fr grid-flow-col gap-4">
                {processData.map((data) => (
                  <Card key={data.process_level}>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-sm font-medium capitalize tracking-tight">
                        {getStatusText(data.process_level)}
                      </CardTitle>
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{data._count}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          <div className="col-span-5">
            <Card>
              <CardHeader>
                <CardTitle>Leaders&apos; Data</CardTitle>
                <CardDescription>
                  Showing the number of Leader&apos; disciples
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 -ml-2 pb-20 pl-0">
                <LeadersData leadersDiscipleData={primaryData} />
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="col-span-2 h-full">
          <Card className="flex h-full flex-col">
            <CardHeader>
              <CardTitle>Latest Cell Reports</CardTitle>
            </CardHeader>
            <CardContent className="max-h-[500px] flex-1 overflow-y-auto">
              <ul className="pb-3">
                <li className="mb-4 text-lg font-medium">
                  Total CGs this week:{" "}
                  {weeklyReports.reduce((t, r) => t + r.cell_reports.length, 0)}
                </li>
                {weeklyReports.map((leader) => (
                  <li
                    key={leader.id}
                    className="grid grid-cols-2 gap-2 border-b py-3"
                  >
                    <p>Name:</p>
                    <p>{leader.name}</p>
                    <p>No. of CGs Done: </p>
                    <p>{leader.cell_reports.length}</p>
                    <p>No. of Disciples:</p>
                    <p>{leader.disciples.length}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Link
                href="/cell-reports"
                className={cn(buttonVariants(), "w-full")}
              >
                View All
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
