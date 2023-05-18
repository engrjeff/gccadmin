"use client"

import * as React from "react"
import { Disciple } from "@prisma/client"

interface CurrentDiscipleContextState {
  selectedDisciple: Disciple | null
  setSelectedDisciple: React.Dispatch<React.SetStateAction<Disciple | null>>
  editFormOpen: boolean
  setEditFormOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const CurrentDiscipleContext =
  React.createContext<CurrentDiscipleContextState | null>(null)

CurrentDiscipleContext.displayName = "CurrentDisciple"

function CurrentDiscipleProvider({ children }: { children: React.ReactNode }) {
  const [selectedDisciple, setSelectedDisciple] =
    React.useState<Disciple | null>(null)

  const [editFormOpen, setEditFormOpen] = React.useState(false)

  const value = React.useMemo(
    () => ({
      selectedDisciple,
      setSelectedDisciple,
      editFormOpen,
      setEditFormOpen,
    }),
    [editFormOpen, selectedDisciple]
  )

  return (
    <CurrentDiscipleContext.Provider value={value}>
      {children}
    </CurrentDiscipleContext.Provider>
  )
}

export function useCurrentDisciple() {
  const context = React.useContext(CurrentDiscipleContext)

  if (!context)
    throw new Error(
      `useCurrentDisciple hook can only be used inside the <CurrentDiscipleProvider />`
    )

  return context
}

export default CurrentDiscipleProvider
