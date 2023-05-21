export const processLevels = [
  "NONE",
  "PREENC",
  "ENCOUNTER",
  "LEADERSHIP_1",
  "LEADERSHIP_2",
  "LEADERSHIP_3",
].map((p) => ({ value: p, label: p }))

export const memberTypes = ["KIDS", "MEN", "WOMEN", "YOUTH", "YOUNGPRO"].map(
  (m) => ({
    value: m,
    label: m,
  })
)

export const cellStatuses = [
  "FIRST_TIMER",
  "SECOND_TIMER",
  "THIRD_TIMER",
  "REGULAR",
].map((m) => ({
  value: m,
  label: m,
}))

export const churchStatuses = ["NACS", "ACS", "REGULAR"].map((m) => ({
  value: m,
  label: m,
}))
