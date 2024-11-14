import { CellStatus } from "@prisma/client"
import { clsx, type ClassValue } from "clsx"
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
