"use client"

import { Disciple } from "@prisma/client"

import { useSelectedDiscipleStore } from "@/lib/hooks"
import { Button } from "@/components/ui/button"

import DiscipleDeleteDialog from "./disciple-delete-dialog"

function DiscipleDeleteAction({ disciple }: { disciple: Disciple }) {
  const setSelectedDisciple = useSelectedDiscipleStore(
    (state) => state.setSelectedDisciple
  )

  return (
    <div className="space-y-4 rounded-lg bg-danger-light p-4 shadow-lg">
      <h3 className="font-semibold">Delete</h3>
      <Button
        variant="destructive"
        onClick={() => setSelectedDisciple(disciple)}
      >
        Delete
      </Button>
      <p className="text-xs text-muted-foreground">
        Note: This action cannot be undone.
      </p>
      <DiscipleDeleteDialog />
    </div>
  )
}

export default DiscipleDeleteAction
