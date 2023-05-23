import { create } from "zustand"

interface DiscipleFormSheetState {
  shown: boolean
  openForm: () => void
  closeForm: () => void
}

interface SelectedDiscipleState {
  selectDiscipleId: string | null
  setSelectedDiscipleId: (id: string) => void
}

export const useDiscipleFormSheetStore = create<DiscipleFormSheetState>(
  (set) => ({
    shown: false,
    openForm: () => set({ shown: true }),
    closeForm: () => set({ shown: true }),
  })
)

export const useSelectedDiscipleStore = create<SelectedDiscipleState>(
  (set) => ({
    selectDiscipleId: null,
    setSelectedDiscipleId: (id) => set({ selectDiscipleId: id }),
  })
)
