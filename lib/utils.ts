import { CellReportQueryArgs } from "@/features/cell-reports/schema"
import { CellStatus } from "@prisma/client"
import { clsx, type ClassValue } from "clsx"
import {
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
} from "date-fns"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function removeUnderscores(inputStr: string) {
  if (inputStr && ["NACS", "ACS"].includes(inputStr)) return inputStr

  if (!inputStr?.includes("_")) {
    return inputStr?.toLowerCase()
  }

  return inputStr.replaceAll("_", " ").toLowerCase()
}

export const formatTime = (timeStr: string) => {
  const parts = timeStr.split(":")
  let hours = parseInt(parts[0])
  let minutes = parseInt(parts[1])
  let ampm = hours >= 12 ? "PM" : "AM"
  hours = hours % 12
  hours = hours ? hours : 12
  const minutesStr = minutes.toString().padStart(2, "0")
  let strTime = hours + ":" + minutesStr + " " + ampm
  return strTime
}

export const getNextCellStatus = (cellStatus: CellStatus): CellStatus => {
  switch (cellStatus) {
    case "FIRST_TIMER":
      return "SECOND_TIMER"
    case "SECOND_TIMER":
      return "THIRD_TIMER"
    case "THIRD_TIMER":
      return "REGULAR"
    default:
      return "REGULAR"
  }
}

export function getSkip({ limit, page }: { limit?: number; page?: number }) {
  const _limit = limit ?? 12
  const _page = page ?? 1

  return _limit * (_page - 1)
}

export function getInitials(inputStr: string) {
  return inputStr
    .split(" ")
    .slice(0, 2)
    .map((c) => c.substring(0, 1))
    .join("")
}

export function getDateRange(
  preset: CellReportQueryArgs["dateRange"]
): { start: Date; end: Date } | undefined {
  if (!preset) return undefined

  const now = new Date()

  if (preset === "this_week") {
    return {
      start: startOfWeek(now, { weekStartsOn: 1 }),
      end: endOfWeek(now, { weekStartsOn: 1 }),
    }
  }

  if (preset === "last_week") {
    return {
      start: subDays(startOfWeek(now, { weekStartsOn: 1 }), 7),
      end: subDays(endOfWeek(now, { weekStartsOn: 1 }), 7),
    }
  }

  if (preset === "this_month") {
    return {
      start: startOfMonth(now),
      end: endOfMonth(now),
    }
  }

  if (preset === "last_month") {
    return {
      start: startOfMonth(subMonths(now, 1)),
      end: endOfMonth(subMonths(now, 1)),
    }
  }
}
