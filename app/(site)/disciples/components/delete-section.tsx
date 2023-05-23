"use client"

import { useState } from "react"
import { Disciple } from "@prisma/client"

import { Button } from "@/components/ui/button"

import DiscipleDeleteDialog from "./delete-disciple-dialog"

function DeleteSection({ disciple }: { disciple: Disciple }) {
  const [deleteDialogShown, setDeleteDialogShown] = useState(false)

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <p className="text-sm font-semibold uppercase text-destructive">Delete</p>
      <Button
        type="button"
        size="sm"
        variant="destructive"
        onClick={() => setDeleteDialogShown(true)}
      >
        Delete this disciple
      </Button>
      <DiscipleDeleteDialog
        open={deleteDialogShown}
        onOpenChange={setDeleteDialogShown}
        disciple={disciple}
      />
    </div>
  )
}

export default DeleteSection
