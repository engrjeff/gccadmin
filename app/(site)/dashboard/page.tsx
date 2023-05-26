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
  const reports = await getDashboardData()

  return (
    <div className="flex h-full flex-col gap-7 overflow-y-auto pr-3">
      <div className="flex justify-between">
        <PageTitle
          title="Dashboard"
          subtitle="A quick view of church statistics"
        />
      </div>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-6 h-full">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-foreground">
                Leader&apos; Data
              </CardTitle>
              <CardDescription>No. of Disciples by Leader</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <LeadersData leadersDiscipleData={reports.primaryData} />
            </CardContent>
          </Card>
        </div>
        <div className="col-span-6">
          <Tabs defaultValue="weekly_report" className="w-full">
            <TabsList className="mb-5">
              <TabsTrigger value="weekly_report">Weekly Report</TabsTrigger>
              <TabsTrigger value="member_type">Member Type</TabsTrigger>
              <TabsTrigger value="cell_status">Cell Status</TabsTrigger>
              <TabsTrigger value="church_status">Church Status</TabsTrigger>
              <TabsTrigger value="process_level">Process Level</TabsTrigger>
            </TabsList>
            <TabsContent value="weekly_report">
              <Card>
                <div className="flex items-start justify-between p-4">
                  <CardDescription className="font-semibold text-foreground">
                    Cell Group Weekly Report
                  </CardDescription>
                  <DateRangePicker />
                </div>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Leader</TableHead>
                        <TableHead>CG This Week</TableHead>
                        <TableHead>Unique</TableHead>
                        <TableHead>CG Last Week</TableHead>
                        <TableHead>Unique (Last Week)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reports.weeklyReports.cgCountByLeaderData.map((d) => (
                        <TableRow key={d.id} className="border-0">
                          <TableCell className="font-medium">
                            <Link
                              href={`/disciples/${d.id}`}
                              className="hover:underline"
                            >
                              {d.name}
                            </Link>
                          </TableCell>
                          <TableCell>{d.cgCount}</TableCell>
                          <TableCell>
                            {d.uniqueDisciplesDuringCgCount}
                          </TableCell>
                          <TableCell>
                            {
                              reports.pastWeeklyReports.cgCountByLeaderData.find(
                                (r) => r.id === d.id
                              )?.cgCount
                            }
                          </TableCell>
                          <TableCell>
                            {
                              reports.pastWeeklyReports.cgCountByLeaderData.find(
                                (r) => r.id === d.id
                              )?.uniqueDisciplesDuringCgCount
                            }
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="member_type">
              <Card>
                <div className="flex items-center justify-between p-4">
                  <CardDescription className="font-semibold text-foreground">
                    Leader&apos;s Disciples by Member Type
                  </CardDescription>
                </div>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Leader</TableHead>
                        {memberTypes.map((i) => (
                          <TableHead key={i.value}>{i.label}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reports.disciplesTallyData.map((leader) => (
                        <TableRow key={leader.details.id} className="border-0">
                          <TableCell>
                            <Link
                              href={`/disciples/${leader.details.id}`}
                              className="hover:underline"
                            >
                              {leader.details.name}
                            </Link>
                          </TableCell>
                          <TableCell>{leader.memberType.KIDS}</TableCell>
                          <TableCell>{leader.memberType.MEN}</TableCell>
                          <TableCell>{leader.memberType.WOMEN}</TableCell>
                          <TableCell>{leader.memberType.YOUTH}</TableCell>
                          <TableCell>{leader.memberType.YOUNGPRO}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="cell_status">
              <Card>
                <div className="flex items-center justify-between p-4">
                  <CardDescription className="font-semibold text-foreground">
                    Leader&apos;s Disciples by Cell Status
                  </CardDescription>
                </div>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Leader</TableHead>
                        {cellStatuses.map((i) => (
                          <TableHead key={i.value}>
                            {i.label.replace(/_/g, " ")}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reports.disciplesTallyData.map((leader) => (
                        <TableRow key={leader.details.id} className="border-0">
                          <TableCell>
                            <Link
                              href={`/disciples/${leader.details.id}`}
                              className="hover:underline"
                            >
                              {leader.details.name}
                            </Link>
                          </TableCell>
                          <TableCell>{leader.cellStatus.FIRST_TIMER}</TableCell>
                          <TableCell>
                            {leader.cellStatus.SECOND_TIMER}
                          </TableCell>
                          <TableCell>{leader.cellStatus.THIRD_TIMER}</TableCell>
                          <TableCell>{leader.cellStatus.REGULAR}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="church_status">
              <Card>
                <div className="flex items-center justify-between p-4">
                  <CardDescription className="font-semibold text-foreground">
                    Leader&apos;s Disciples by Church Status
                  </CardDescription>
                </div>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Leader</TableHead>
                        {churchStatuses.map((i) => (
                          <TableHead key={i.value}>
                            {i.label.replace(/_/g, " ")}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reports.disciplesTallyData.map((leader) => (
                        <TableRow key={leader.details.id} className="border-0">
                          <TableCell>
                            <Link
                              href={`/disciples/${leader.details.id}`}
                              className="hover:underline"
                            >
                              {leader.details.name}
                            </Link>
                          </TableCell>
                          <TableCell>{leader.churchStatus.NACS}</TableCell>
                          <TableCell>{leader.churchStatus.ACS}</TableCell>
                          <TableCell>{leader.churchStatus.REGULAR}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="process_level">
              <Card>
                <div className="flex items-center justify-between p-4">
                  <CardDescription className="font-semibold text-foreground">
                    Leader&apos;s Disciples by Process Level
                  </CardDescription>
                </div>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Leader</TableHead>
                        {processLevels.slice(0, 5).map((i) => (
                          <TableHead key={i.value}>
                            {i.label.replace(/_/g, " ")}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reports.disciplesTallyData.map((leader) => (
                        <TableRow key={leader.details.id} className="border-0">
                          <TableCell>
                            <Link
                              href={`/disciples/${leader.details.id}`}
                              className="hover:underline"
                            >
                              {leader.details.name}
                            </Link>
                          </TableCell>
                          <TableCell>{leader.processLevels.NONE}</TableCell>
                          <TableCell>{leader.processLevels.PREENC}</TableCell>
                          <TableCell>
                            {leader.processLevels.ENCOUNTER}
                          </TableCell>
                          <TableCell>
                            {leader.processLevels.LEADERSHIP_1}
                          </TableCell>
                          <TableCell>
                            {leader.processLevels.LEADERSHIP_2}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
