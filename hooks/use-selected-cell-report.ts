import { create } from "zustand"

import { CellReportRecord } from "@/app/(site)/cell-reports/types"

interface State {
  cellReport: CellReportRecord | null
  setCellReport: (cellReport: CellReportRecord | null) => void
}

export const useSelectedCellReport = create<State>((set) => ({
  cellReport: null,
  setCellReport: (cellReport) => set({ cellReport }),
}))

// export function useCellReport() {
//   const cellReportId = useSelectedCellReport((state) => state.cellReportId)
//   return useQuery({
//     queryKey: ["cell-report", cellReportId],
//     queryFn: () => getCellReportById(cellReportId!),
//     enabled: Boolean(cellReportId),
//   })
// }
