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
