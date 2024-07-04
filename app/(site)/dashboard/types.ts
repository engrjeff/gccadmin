export interface KPIData {
  totalDisciples: number
  activeInChurch: number
  activeInCell: number
  disciplesInProcess: number
  newlyWonSouls: number
}

type StatusInfo = {
  value: number
  name: string
  valueDesc: string
}

export interface ChurchStatusData {
  churchData: StatusInfo[]
  cellData: StatusInfo[]
  processData: StatusInfo[]
  memberTypeData: StatusInfo[]
}
