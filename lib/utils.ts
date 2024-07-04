import {
  CellStatus,
  ChurchStatus,
  MemberType,
  ProcessLevel,
} from "@prisma/client"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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

export function capitalize(input: string) {
  return input.charAt(0).toUpperCase() + input.slice(1)
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

export const getChurchStatusText = (churchStatus: ChurchStatus) => {
  switch (churchStatus) {
    case "ACS":
      return "Attended Church"
    case "NACS":
      return "Not Yet Attended Church"
    case "REGULAR":
      return "Regular Attendees"
  }
}

export const getCellStatusText = (cellStatus: CellStatus) => {
  switch (cellStatus) {
    case "FIRST_TIMER":
      return "Newly won soul"
    case "SECOND_TIMER":
      return "2nd-time attendee"
    case "THIRD_TIMER":
      return "3rd-time attendee"
    case "REGULAR":
      return "Regular attendee"
  }
}

export const getProcessLevelText = (processLevel: ProcessLevel) => {
  switch (processLevel) {
    case "NONE":
      return "Not in the process yet"
    case "PREENC":
      return "Pre-Encounter delegates"
    case "ENCOUNTER":
      return "Attended Ecnounter"
    case "LEADERSHIP_1":
      return "In Leadership Level 1"
    case "LEADERSHIP_2":
      return "In Leadership Level 2"
    case "LEADERSHIP_3":
      return "In Leadership Level 3"
  }
}

export const getMemberTypeText = (value: MemberType) => {
  switch (value) {
    case "KIDS":
      return {
        name: "Kids",
        desc: "Kids, elementary",
      }
    case "MEN":
      return {
        name: "Men",
        desc: "Married men, fathers",
      }
    case "WOMEN":
      return {
        name: "Women",
        desc: "Married women, mothers",
      }
    case "YOUTH":
      return {
        name: "Youth",
        desc: "Late teens, students",
      }
    case "YOUNGPRO":
      return {
        name: "Young Pro",
        desc: "Young, unmarried professionals",
      }
  }
}
