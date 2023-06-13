import { LessonSeries, type Disciple } from "@prisma/client"
import { create } from "zustand"

interface DiscipleFormSheetState {
  shown: boolean
  openForm: () => void
  closeForm: () => void
  toggle: (open: boolean) => void
}

interface SelectedDiscipleState {
  selectedDisciple: Disciple | null
  setSelectedDisciple: (disciple: Disciple | null) => void
}

interface LessonFormState {
  selectedSeries: LessonSeries | null
  setSelectedSeries: (series: LessonSeries | null) => void
  shown: boolean
  openForm: () => void
  closeForm: () => void
  toggle: (open: boolean) => void
}

export const useDiscipleFormSheetStore = create<DiscipleFormSheetState>(
  (set) => ({
    shown: false,
    openForm: () => set({ shown: true }),
    closeForm: () => set({ shown: true }),
    toggle: (open) => set({ shown: open }),
  })
)

export const useSelectedDiscipleStore = create<SelectedDiscipleState>(
  (set) => ({
    selectedDisciple: null,
    setSelectedDisciple: (disciple) => set({ selectedDisciple: disciple }),
  })
)

export const useLessonFormSheetStore = create<LessonFormState>((set) => ({
  selectedSeries: null,
  setSelectedSeries: (series) => set({ selectedSeries: series }),
  shown: false,
  openForm: () => set({ shown: true }),
  closeForm: () => set({ shown: true }),
  toggle: (open) => set({ shown: open }),
}))
