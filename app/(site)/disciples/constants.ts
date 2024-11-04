import { Option } from "@/types/common"

export const processLevels: Option[] = [
  "NONE",
  "PREENC",
  "ENCOUNTER",
  "LEADERSHIP_1",
  "LEADERSHIP_2",
  "LEADERSHIP_3",
].map((p) => ({ value: p, label: p.replace("_", " ").toLowerCase() }))

export const memberTypes: Option[] = [
  "KIDS",
  "MEN",
  "WOMEN",
  "YOUTH",
  "YOUNGPRO",
].map((m) => ({
  value: m,
  label: m.toLowerCase(),
}))

export const cellStatuses: Option[] = [
  "FIRST_TIMER",
  "SECOND_TIMER",
  "THIRD_TIMER",
  "REGULAR",
].map((m) => ({
  value: m,
  label: m.replace("_", " ").toLowerCase(),
}))

export const churchStatuses: Option[] = ["NACS", "ACS", "REGULAR"].map((m) => ({
  value: m,
  label: m === "REGULAR" ? "Regular" : m,
}))

export const processLevelStatuses: Option[] = [
  "NOT_STARTED",
  "ON_GOING",
  "PENDING_REQUIREMENTS",
  "FINISHED",
  "UNFINISHED",
  "DROPPED",
].map((m) => ({
  value: m,
  label: m.replace("_", " ").toLowerCase(),
}))
