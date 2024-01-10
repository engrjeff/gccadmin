"use client"

import { useState } from "react"
import Link from "next/link"
import { CellReport, Disciple } from "@prisma/client"
import { format } from "date-fns"

import { cn, formatTime } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

import { type CellReportRecord } from "../types"

const typeColor: Record<CellReport["type"], string> = {
  SOULWINNING: "text-black bg-green-500",
  DISCIPLESHIP: "text-black bg-orange-500",
  OPEN: "text-black bg-sky-500",
}

const cellStatusColorMap: Record<Disciple["cell_status"], string> = {
  FIRST_TIMER: "text-emerald-500",
  SECOND_TIMER: "text-sky-500",
  THIRD_TIMER: "text-blue-500",
  REGULAR: "text-primary",
}

function CellReportMobileListItem({
  cellreport,
}: {
  cellreport: CellReportRecord
}) {
  const [menuOpen, setMenuOpen] = useState(false)

  const lesson = cellreport.lessonId
    ? cellreport.lesson?.title
    : cellreport.lesson_name

  return (
    <Drawer open={menuOpen} onOpenChange={setMenuOpen}>
      <DrawerTrigger asChild>
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="line-clamp-1 text-sm">
              Lesson: {lesson}
            </CardTitle>
            <CardDescription className="text-xs">
              Led by:{" "}
              {cellreport.assistant
                ? cellreport.assistant.disciple.name
                : cellreport.leader.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs">
              {cellreport.attendees.length}{" "}
              {cellreport.attendees.length > 1 ? "attendees" : "attendee"}
            </p>
            <Badge
              className={cn("rounded capitalize", typeColor[cellreport.type])}
            >
              {cellreport.type.split("_").join(" ").toLowerCase()}
            </Badge>
          </CardContent>
        </Card>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="pb-0 text-left">
          <DrawerTitle className="flex flex-col items-start gap-2">
            {lesson}{" "}
            <Badge
              className={cn("rounded capitalize", typeColor[cellreport.type])}
            >
              {cellreport.type.split("_").join(" ").toLowerCase()}
            </Badge>
          </DrawerTitle>
          <DrawerDescription>
            <span className="font-semibold">Led by:</span>{" "}
            <Link
              href={`/disciples/${
                cellreport.assistant_id
                  ? cellreport.assistant_id
                  : cellreport.leader.name
              }`}
              className="underline hover:text-white hover:no-underline"
            >
              {cellreport.assistant
                ? cellreport.assistant.disciple.name
                : cellreport.leader.name}
            </Link>
            {cellreport.assistant_id ? (
              <div>
                <span className="font-semibold">Under:</span>{" "}
                <Link
                  href={`/disciples/${cellreport.leader.id}`}
                  className="underline hover:text-white hover:no-underline"
                >
                  {cellreport.leader.name}
                </Link>
              </div>
            ) : null}
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4">
          <div className="py-2">
            <p className="text-sm font-semibold text-muted-foreground">Venue</p>
            <p className="text-sm">{cellreport.venue}</p>
          </div>
          <div className="py-2">
            <p className="text-sm font-semibold text-muted-foreground">
              Date and Time
            </p>
            <p className="text-sm">
              {format(cellreport.date, "MMM dd, yyyy")},{" "}
              {formatTime(cellreport.time)}
            </p>
          </div>
          <div className="py-2">
            <p className="text-sm font-semibold text-muted-foreground">
              Lesson
            </p>
            <p className="text-sm">{lesson}</p>
          </div>
          <div className="py-2">
            <p className="text-sm font-semibold text-muted-foreground">
              Scriptures
            </p>
            <ul className="flex flex-wrap items-center gap-1">
              {[
                cellreport.lesson?.scripture_references,
                cellreport.scripture_references,
              ]
                .flat()
                .filter(Boolean)
                .map((sr, index) => (
                  <li key={`scripture-ref-${index + 1}`}>
                    <Badge variant="secondary" className="rounded">
                      {sr}
                    </Badge>
                  </li>
                ))}
            </ul>
          </div>
          <div className="py-4">
            <p className="mb-2 text-sm font-semibold text-muted-foreground">
              Attendees: ({cellreport.attendees.length})
            </p>
            <ul className="max-h-[400px] space-y-2 overflow-y-auto pb-4">
              {cellreport.attendees.map((attendee) => (
                <li key={attendee.disciple_id}>
                  {
                    <Link
                      href={`/disciples/${attendee.disciple_id}`}
                      className={cn(
                        buttonVariants({ variant: "secondary" }),
                        "w-full justify-between"
                      )}
                    >
                      <span className="text-sm">{attendee.disciple.name}</span>
                      <Badge variant="outline" className="capitalize">
                        <span
                          className={cn(
                            "mr-2 scale-150",
                            cellStatusColorMap[attendee.disciple.cell_status]
                          )}
                        >
                          &#x2022;
                        </span>
                        {attendee.disciple.cell_status
                          .split("_")
                          .join(" ")
                          .toLowerCase()}
                      </Badge>
                    </Link>
                  }
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default CellReportMobileListItem
