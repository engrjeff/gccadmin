export const processLevels = [
  "NEW",
  "PREENC",
  "ENCOUNTER",
  "LEADERSHIP1",
  "LEADERSHIP2",
  "LEADERSHIP3",
].map((p) => ({ value: p, label: p }))

export const memberTypes = ["KIDS", "MEN", "WOMEN", "YOUTH", "YOUNGPRO"].map(
  (m) => ({
    value: m,
    label: m,
  })
)
