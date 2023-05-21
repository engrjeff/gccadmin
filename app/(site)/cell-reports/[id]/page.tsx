import Link from "next/link"
import { CellType, ProcessLevel } from "@prisma/client"
import { format } from "date-fns"
import { ExternalLink } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import PageTitle from "@/components/page-title"

import { getCellReportById } from "../service"

const cellTypeColorMap: Record<CellType, string> = {
  SOULWINNING: "bg-green-500 dark:bg-green-700",
  OPEN: "bg-sky-500 dark:bg-sky-700",
  DISCIPLESHIP: "bg-orange-500 dark:bg-orange-700",
}

const processLevelColorMap: Record<ProcessLevel, string> = {
  NONE: "bg-red-500 dark:bg-red-700",
  ENCOUNTER: "bg-orange-500 dark:bg-orange-700",
  PREENC: "bg-amber-500 dark:bg-amber-700",
  LEADERSHIP_1: "bg-lime-500 dark:bg-lime-700",
  LEADERSHIP_2: "bg-green-500 dark:bg-green-700",
  LEADERSHIP_3: "bg-sky-500 dark:bg-sky-700",
}

function turnToTags(strArr?: string[]) {
  if (!strArr) return null
  return strArr.join(", ")
}

async function ReportDetailPage({ params }: { params: { id: string } }) {
  const report = await getCellReportById(params.id)

  return (
    <>
      <div className="flex justify-between">
        <PageTitle
          title={
            report.lesson_name ? report.lesson_name : report.lesson?.title!
          }
          subtitle={`Led by: ${report.leader.name}`}
        />
        <Button size="sm" variant="secondary">
          Print as PDF
        </Button>
      </div>
      <p className="py-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
        Report Details
      </p>
      <div className="mt-3 space-y-3">
        <div className="grid grid-cols-3">
          <p className="font-semibold">Cell Type</p>
          <Badge
            className={cn(
              "justify-self-start rounded text-white",
              cellTypeColorMap[report.type]
            )}
          >
            {report.type}
          </Badge>
        </div>
        <div className="grid grid-cols-3">
          <p className="font-semibold">Venue</p>
          <p>{report.venue}</p>
        </div>
        <div className="grid grid-cols-3">
          <p className="font-semibold">Date</p>
          <p>
            {format(report.date, "MMMM dd, yyyy")} at {report.time}
          </p>
        </div>
        {report.assistant_id && (
          <div className="grid grid-cols-3">
            <p className="font-semibold">Assistant Leader</p>
            <p>{report.assistant?.disciple.name}</p>
          </div>
        )}
        <div className="grid grid-cols-3">
          <p className="font-semibold">Scripture References</p>
          <p className="col-span-2 inline">
            {report.scripture_references.length > 0
              ? turnToTags(report.scripture_references)
              : turnToTags(report.lesson?.scripture_references)}
          </p>
        </div>
        <div className="grid grid-cols-3">
          <p className="font-semibold">Attendees</p>
          <ul className="col-span-2 space-y-2">
            {report.attendees.map(({ disciple }) => (
              <li
                key={disciple.id}
                className="grid grid-cols-4 items-center gap-2"
              >
                <span className="col-span-2">{disciple.name}</span>
                <Badge
                  className={cn(
                    "justify-self-start rounded text-white",
                    processLevelColorMap[disciple.process_level]
                  )}
                >
                  {disciple.process_level}
                </Badge>
                <Link
                  href={`/disciples/${disciple.id}`}
                  aria-label={`go to ${disciple.name} details page`}
                  className="flex items-center justify-between justify-self-end hover:text-primary"
                >
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}

export default ReportDetailPage
